const { getDB } = require('../config/db');

async function markAttendance(req, res, next) {
    try {
        const { date, classId, records } = req.body; // records: [{ studentId, status, remarks }]
        if (!date || !classId || !Array.isArray(records)) {
            return res.status(400).json({ error: 'date, classId, and records array required' });
        }

        const db = await getDB();
        
        for (const rec of records) {
            const attId = 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
            await db.run(
                `INSERT INTO attendance (id, date, student_id, class_id, status, remarks, recorded_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(date, student_id, subject_id) DO UPDATE SET
                    status = excluded.status,
                    remarks = excluded.remarks,
                    recorded_by = excluded.recorded_by`,
                [attId, date, rec.studentId, classId, rec.status, rec.remarks || '', req.user.id]
            );
        }

        res.json({ message: `Attendance marked for ${records.length} students` });
    } catch (err) {
        next(err);
    }
}

async function getAttendance(req, res, next) {
    try {
        const { date, classId, studentId } = req.query;
        const db = await getDB();

        let query = `
            SELECT a.*, u.full_name as student_name, s.roll_number, c.name as class_name
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN classes c ON a.class_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (date) {
            query += ` AND a.date = ?`;
            params.push(date);
        }

        if (classId) {
            query += ` AND a.class_id = ?`;
            params.push(classId);
        }

        if (studentId) {
            query += ` AND a.student_id = ?`;
            params.push(studentId);
        } else if (req.user.role === 'student') {
            const std = await db.get(`SELECT id FROM students WHERE user_id = ?`, [req.user.id]);
            if (std) {
                query += ` AND a.student_id = ?`;
                params.push(std.id);
            }
        } else if (req.user.role === 'parent') {
            const std = await db.get(`SELECT id FROM students WHERE parent_user_id = ?`, [req.user.id]);
            if (std) {
                query += ` AND a.student_id = ?`;
                params.push(std.id);
            }
        }

        query += ` ORDER BY a.date DESC, u.full_name ASC`;

        const list = await db.all(query, params);

        // Calculate summary stats
        const total = list.length;
        const presentCount = list.filter(item => item.status === 'present').length;
        const absentCount = list.filter(item => item.status === 'absent').length;
        const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 100;

        res.json({
            attendance: list,
            summary: {
                total,
                presentCount,
                absentCount,
                percentage
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    markAttendance,
    getAttendance
};
