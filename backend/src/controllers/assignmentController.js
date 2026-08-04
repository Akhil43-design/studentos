const { getDB } = require('../config/db');

async function getAssignments(req, res, next) {
    try {
        const db = await getDB();
        let query = `
            SELECT a.*, s.name as subject_name, s.color as subject_color, c.name as class_name, u.full_name as teacher_name
            FROM assignments a
            JOIN subjects s ON a.subject_id = s.id
            JOIN classes c ON a.class_id = c.id
            JOIN teachers t ON a.teacher_id = t.id
            JOIN users u ON t.user_id = u.id
        `;
        const params = [];

        if (req.user.role === 'student') {
            const std = await db.get(`SELECT class_id FROM students WHERE user_id = ?`, [req.user.id]);
            if (std) {
                query += ` WHERE a.class_id = ?`;
                params.push(std.class_id);
            }
        } else if (req.user.role === 'teacher') {
            const tch = await db.get(`SELECT id FROM teachers WHERE user_id = ?`, [req.user.id]);
            if (tch) {
                query += ` WHERE a.teacher_id = ?`;
                params.push(tch.id);
            }
        }

        query += ` ORDER BY a.due_date ASC`;

        const assignments = await db.all(query, params);
        
        // If student, attach submission status
        if (req.user.role === 'student') {
            const std = await db.get(`SELECT id FROM students WHERE user_id = ?`, [req.user.id]);
            if (std) {
                for (let a of assignments) {
                    const sub = await db.get(
                        `SELECT id, status, submitted_at, marks, feedback, file_path FROM submissions WHERE assignment_id = ? AND student_id = ?`,
                        [a.id, std.id]
                    );
                    a.submission = sub || null;
                }
            }
        }

        res.json({ assignments });
    } catch (err) {
        next(err);
    }
}

async function createAssignment(req, res, next) {
    try {
        const { title, description, subjectId, classId, dueDate, maxMarks } = req.body;
        if (!title || !subjectId || !classId || !dueDate) {
            return res.status(400).json({ error: 'Title, subjectId, classId, and dueDate are required' });
        }

        const db = await getDB();
        const tch = await db.get(`SELECT id FROM teachers WHERE user_id = ?`, [req.user.id]);
        if (!tch) {
            return res.status(403).json({ error: 'Teacher profile not found' });
        }

        const id = 'asg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;

        await db.run(
            `INSERT INTO assignments (id, teacher_id, subject_id, class_id, title, description, file_path, due_date, max_marks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tch.id, subjectId, classId, title, description || '', filePath, dueDate, maxMarks || 100]
        );

        // Notify students in class
        const students = await db.all(`SELECT user_id FROM students WHERE class_id = ?`, [classId]);
        for (const s of students) {
            await db.run(
                `INSERT INTO notifications (id, user_id, type, title, message) VALUES (?, ?, ?, ?, ?)`,
                ['ntf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4), s.user_id, 'assignment', `New Assignment: ${title}`, `Due date: ${new Date(dueDate).toLocaleDateString()}`]
            );
        }

        const created = await db.get(`SELECT * FROM assignments WHERE id = ?`, [id]);
        res.status(201).json({ message: 'Assignment created successfully', assignment: created });
    } catch (err) {
        next(err);
    }
}

async function submitAssignment(req, res, next) {
    try {
        const { assignmentId, noteId, drawingId } = req.body;
        if (!assignmentId) {
            return res.status(400).json({ error: 'Assignment ID is required' });
        }

        const db = await getDB();
        const std = await db.get(`SELECT id FROM students WHERE user_id = ?`, [req.user.id]);
        if (!std) {
            return res.status(403).json({ error: 'Student profile not found' });
        }

        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        const subId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        // Check if submission already exists
        const existing = await db.get(`SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?`, [assignmentId, std.id]);

        if (existing) {
            await db.run(
                `UPDATE submissions SET file_path = COALESCE(?, file_path), note_id = COALESCE(?, note_id), drawing_id = COALESCE(?, drawing_id), submitted_at = CURRENT_TIMESTAMP, status = 'submitted' WHERE id = ?`,
                [filePath, noteId, drawingId, existing.id]
            );
            res.json({ message: 'Submission updated successfully', submissionId: existing.id });
        } else {
            await db.run(
                `INSERT INTO submissions (id, assignment_id, student_id, file_path, note_id, drawing_id, status) VALUES (?, ?, ?, ?, ?, ?, 'submitted')`,
                [subId, assignmentId, std.id, filePath, noteId || null, drawingId || null]
            );
            res.status(201).json({ message: 'Assignment submitted successfully', submissionId: subId });
        }
    } catch (err) {
        next(err);
    }
}

async function getSubmissions(req, res, next) {
    try {
        const { assignmentId } = req.params;
        const db = await getDB();

        const submissions = await db.all(
            `SELECT sub.*, u.full_name as student_name, s.roll_number 
             FROM submissions sub
             JOIN students s ON sub.student_id = s.id
             JOIN users u ON s.user_id = u.id
             WHERE sub.assignment_id = ?
             ORDER BY sub.submitted_at DESC`,
            [assignmentId]
        );

        res.json({ submissions });
    } catch (err) {
        next(err);
    }
}

async function gradeSubmission(req, res, next) {
    try {
        const { submissionId } = req.params;
        const { status, marks, feedback } = req.body;

        const db = await getDB();
        await db.run(
            `UPDATE submissions SET status = ?, marks = ?, feedback = ? WHERE id = ?`,
            [status || 'approved', marks, feedback || '', submissionId]
        );

        res.json({ message: 'Submission evaluated successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAssignments,
    createAssignment,
    submitAssignment,
    getSubmissions,
    gradeSubmission
};
