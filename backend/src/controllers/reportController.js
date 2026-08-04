const PDFDocument = require('pdfkit');
const { getDB } = require('../config/db');

async function exportAttendanceReport(req, res, next) {
    try {
        const { classId, format = 'json' } = req.query;
        const db = await getDB();

        const attendance = await db.all(
            `SELECT a.date, a.status, a.remarks, u.full_name as student_name, s.roll_number, c.name as class_name
             FROM attendance a
             JOIN students s ON a.student_id = s.id
             JOIN users u ON s.user_id = u.id
             JOIN classes c ON a.class_id = c.id
             ${classId ? 'WHERE a.class_id = ?' : ''}
             ORDER BY a.date DESC, u.full_name ASC`,
            classId ? [classId] : []
        );

        if (format === 'csv') {
            let csv = 'Date,Student Name,Roll Number,Class,Status,Remarks\n';
            attendance.forEach(row => {
                csv += `"${row.date}","${row.student_name}","${row.roll_number}","${row.class_name}","${row.status}","${row.remarks}"\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
            return res.send(csv);
        }

        if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 40 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.pdf');

            doc.pipe(res);
            doc.fontSize(20).fillColor('#38BDF8').text('SmartSlate - Attendance Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).fillColor('#333333').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);

            attendance.slice(0, 50).forEach((row, i) => {
                doc.fontSize(10).fillColor('#1E293B').text(`${i + 1}. [${row.date}] ${row.student_name} (${row.roll_number}) - Status: ${row.status.toUpperCase()}`);
            });

            doc.end();
            return;
        }

        res.json({ attendance });
    } catch (err) {
        next(err);
    }
}

async function exportMarksReport(req, res, next) {
    try {
        const { examId, format = 'json' } = req.query;
        const db = await getDB();

        const marks = await db.all(
            `SELECT em.marks_obtained, em.remarks, e.title as exam_title, e.max_marks, u.full_name as student_name, s.roll_number
             FROM exam_marks em
             JOIN exams e ON em.exam_id = e.id
             JOIN students s ON em.student_id = s.id
             JOIN users u ON s.user_id = u.id
             ${examId ? 'WHERE em.exam_id = ?' : ''}
             ORDER BY em.marks_obtained DESC`,
            examId ? [examId] : []
        );

        if (format === 'csv') {
            let csv = 'Exam Title,Student Name,Roll Number,Marks Obtained,Max Marks,Percentage,Remarks\n';
            marks.forEach(row => {
                const pct = ((row.marks_obtained / row.max_marks) * 100).toFixed(1);
                csv += `"${row.exam_title}","${row.student_name}","${row.roll_number}",${row.marks_obtained},${row.max_marks},"${pct}%","${row.remarks}"\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=marks_report.csv');
            return res.send(csv);
        }

        res.json({ marks });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    exportAttendanceReport,
    exportMarksReport
};
