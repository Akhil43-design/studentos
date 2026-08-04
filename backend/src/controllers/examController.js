const { getDB } = require('../config/db');

async function getExams(req, res, next) {
    try {
        const db = await getDB();
        const exams = await db.all(
            `SELECT e.*, s.name as subject_name, s.color as subject_color, c.name as class_name
             FROM exams e
             JOIN subjects s ON e.subject_id = s.id
             JOIN classes c ON e.class_id = c.id
             ORDER BY e.exam_date DESC`
        );
        res.json({ exams });
    } catch (err) {
        next(err);
    }
}

async function createExam(req, res, next) {
    try {
        const { title, subjectId, classId, examDate, maxMarks } = req.body;
        if (!title || !subjectId || !classId || !examDate) {
            return res.status(400).json({ error: 'Title, subjectId, classId, and examDate required' });
        }

        const id = 'exm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        const db = await getDB();

        await db.run(
            `INSERT INTO exams (id, title, subject_id, class_id, exam_date, max_marks) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, title, subjectId, classId, examDate, maxMarks || 100]
        );

        res.status(201).json({ message: 'Exam created successfully', examId: id });
    } catch (err) {
        next(err);
    }
}

async function recordMarks(req, res, next) {
    try {
        const { examId, marks } = req.body; // marks: [{ studentId, marksObtained, remarks }]
        if (!examId || !Array.isArray(marks)) {
            return res.status(400).json({ error: 'examId and marks array required' });
        }

        const db = await getDB();
        for (const item of marks) {
            const markId = 'mrk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
            await db.run(
                `INSERT INTO exam_marks (id, exam_id, student_id, marks_obtained, remarks)
                 VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(exam_id, student_id) DO UPDATE SET
                    marks_obtained = excluded.marks_obtained,
                    remarks = excluded.remarks`,
                [markId, examId, item.studentId, item.marksObtained, item.remarks || '']
            );
        }

        res.json({ message: `Marks updated for ${marks.length} students` });
    } catch (err) {
        next(err);
    }
}

async function getStudentMarks(req, res, next) {
    try {
        const { studentId } = req.params;
        const db = await getDB();

        let targetStudentId = studentId;
        if (!targetStudentId || targetStudentId === 'me') {
            if (req.user.role === 'student') {
                const std = await db.get(`SELECT id FROM students WHERE user_id = ?`, [req.user.id]);
                if (std) targetStudentId = std.id;
            } else if (req.user.role === 'parent') {
                const std = await db.get(`SELECT id FROM students WHERE parent_user_id = ?`, [req.user.id]);
                if (std) targetStudentId = std.id;
            }
        }

        const results = await db.all(
            `SELECT em.marks_obtained, em.remarks, e.title as exam_title, e.max_marks, e.exam_date, s.name as subject_name, s.color as subject_color
             FROM exam_marks em
             JOIN exams e ON em.exam_id = e.id
             JOIN subjects s ON e.subject_id = s.id
             WHERE em.student_id = ?
             ORDER BY e.exam_date DESC`,
            [targetStudentId]
        );

        let totalObtained = 0;
        let totalMax = 0;
        results.forEach(r => {
            totalObtained += r.marks_obtained;
            totalMax += r.max_marks;
        });

        const overallPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;

        res.json({
            results,
            analytics: {
                totalObtained,
                totalMax,
                overallPercentage,
                totalExams: results.length
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getExams,
    createExam,
    recordMarks,
    getStudentMarks
};
