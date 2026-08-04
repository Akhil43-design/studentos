const bcrypt = require('bcryptjs');
const { initDB, getDB } = require('../config/db');

async function seed() {
    console.log('[Seed] Starting SmartSlate database seeding...');
    await initDB();
    const db = await getDB();

    // Hashes
    const pinHash = await bcrypt.hash('1234', 10);
    const passStudent = await bcrypt.hash('student123', 10);
    const passTeacher = await bcrypt.hash('teacher123', 10);
    const passParent = await bcrypt.hash('parent123', 10);
    const passAdmin = await bcrypt.hash('admin123', 10);

    // Users
    const users = [
        { id: 'usr_student_1', username: 'student', email: 'student@smartslate.edu', passwordHash: passStudent, pinHash, fullName: 'Alex Morgan', role: 'student' },
        { id: 'usr_teacher_1', username: 'teacher', email: 'teacher@smartslate.edu', passwordHash: passTeacher, pinHash, fullName: 'Dr. Sarah Connor', role: 'teacher' },
        { id: 'usr_parent_1', username: 'parent', email: 'parent@smartslate.edu', passwordHash: passParent, pinHash, fullName: 'Robert Morgan', role: 'parent' },
        { id: 'usr_admin_1', username: 'admin', email: 'admin@smartslate.edu', passwordHash: passAdmin, pinHash, fullName: 'Administrator System', role: 'admin' }
    ];

    for (const u of users) {
        await db.run(
            `INSERT INTO users (id, username, email, password_hash, pin_hash, full_name, role)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(username) DO UPDATE SET full_name = excluded.full_name`,
            [u.id, u.username, u.email, u.passwordHash, u.pinHash, u.fullName, u.role]
        );
    }

    // Classes
    const classes = [
        { id: 'cls_10A', name: 'Grade 10 - Section A', grade: '10', section: 'A' },
        { id: 'cls_10B', name: 'Grade 10 - Section B', grade: '10', section: 'B' }
    ];

    for (const c of classes) {
        await db.run(
            `INSERT INTO classes (id, name, grade, section) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
            [c.id, c.name, c.grade, c.section]
        );
    }

    // Profiles
    await db.run(`INSERT INTO students (id, user_id, roll_number, class_id, parent_user_id) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`, ['std_1', 'usr_student_1', 'ROLL-1001', 'cls_10A', 'usr_parent_1']);
    await db.run(`INSERT INTO teachers (id, user_id, employee_id, department) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`, ['tch_1', 'usr_teacher_1', 'EMP-5001', 'Department of Physics & Math']);
    await db.run(`INSERT INTO parents (id, user_id, phone) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING`, ['prn_1', 'usr_parent_1', '+1 555-0199']);

    // Subjects
    const subjects = [
        { id: 'sbj_phy', name: 'Physics', code: 'PHY101', color: '#38BDF8', description: 'Classical Mechanics & Electricity' },
        { id: 'sbj_mat', name: 'Mathematics', code: 'MAT101', color: '#818CF8', description: 'Calculus & Linear Algebra' },
        { id: 'sbj_chem', name: 'Chemistry', code: 'CHM101', color: '#34D399', description: 'Organic & Physical Chemistry' },
        { id: 'sbj_cs', name: 'Computer Science', code: 'CS101', color: '#F43F5E', description: 'Algorithms & Web Technology' }
    ];

    for (const s of subjects) {
        await db.run(
            `INSERT INTO subjects (id, name, code, color, description) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
            [s.id, s.name, s.code, s.color, s.description]
        );
    }

    // Notes
    const notes = [
        {
            id: 'nte_demo_1',
            user_id: 'usr_student_1',
            subject_id: 'sbj_phy',
            folder: 'Physics Notes',
            title: 'Newtonian Kinematics & Gravity Notes',
            content: '<h2>Newtonian Kinematics Summary</h2><p>Equations of motion under uniform acceleration:</p><ul><li>v = u + at</li><li>s = ut + ½at²</li><li>v² = u² + 2as</li></ul><p>Universal law of gravitation formula: <strong>F = G(m1 * m2) / r²</strong></p>',
            tags: JSON.stringify(['physics', 'formulas', 'exam_prep']),
            is_favorite: 1
        },
        {
            id: 'nte_demo_2',
            user_id: 'usr_student_1',
            subject_id: 'sbj_cs',
            folder: 'Coding',
            title: 'Algorithms & Data Structures Cheatsheet',
            content: '<h3>Key Sorting Complexity</h3><table><tr><th>Algorithm</th><th>Time (Average)</th><th>Space</th></tr><tr><td>QuickSort</td><td>O(N log N)</td><td>O(log N)</td></tr><tr><td>MergeSort</td><td>O(N log N)</td><td>O(N)</td></tr></table>',
            tags: JSON.stringify(['cs', 'algorithms', 'notes']),
            is_favorite: 0
        }
    ];

    for (const n of notes) {
        await db.run(
            `INSERT INTO notes (id, user_id, subject_id, folder, title, content, tags, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
            [n.id, n.user_id, n.subject_id, n.folder, n.title, n.content, n.tags, n.is_favorite]
        );
    }

    // Drawings
    const sampleCanvasData = {
        background: 'grid',
        shapes: [
            { type: 'line', x1: 100, y1: 100, x2: 300, y2: 100, color: '#2A81FF', width: 4 },
            { type: 'rect', x: 100, y: 150, w: 200, h: 120, color: '#9333EA', width: 3 },
            { type: 'path', points: [{x: 50, y: 300}, {x: 80, y: 250}, {x: 120, y: 320}, {x: 200, y: 290}], color: '#F97316', width: 3 }
        ]
    };

    await db.run(
        `INSERT INTO drawings (id, user_id, subject_id, title, canvas_data, preview_img, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['drw_demo_1', 'usr_student_1', 'sbj_phy', 'Free Body Diagram - Slope Block', JSON.stringify(sampleCanvasData), null, 1200, 800]
    );

    // Assignments
    await db.run(
        `INSERT INTO assignments (id, teacher_id, subject_id, class_id, title, description, due_date, max_marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['asg_demo_1', 'tch_1', 'sbj_phy', 'cls_10A', 'Lab Report: Pendulum Oscillation', 'Derive the period formula T = 2π√(L/g) and submit experimental graph notes.', '2026-08-10', 100]
    );

    // Submissions
    await db.run(
        `INSERT INTO submissions (id, assignment_id, student_id, note_id, status, marks, feedback) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['sub_demo_1', 'asg_demo_1', 'std_1', 'nte_demo_1', 'approved', 95, 'Excellent derivation and handwritten notes!']
    );

    // Attendance
    const today = new Date().toISOString().split('T')[0];
    await db.run(
        `INSERT INTO attendance (id, date, student_id, class_id, subject_id, status, remarks, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['att_demo_1', today, 'std_1', 'cls_10A', 'sbj_phy', 'present', 'Active participant in laboratory class', 'usr_teacher_1']
    );

    // Exams & Marks
    await db.run(
        `INSERT INTO exams (id, title, subject_id, class_id, exam_date, max_marks) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['exm_demo_1', 'Mid-Term Physics Assessment', 'sbj_phy', 'cls_10A', '2026-07-15', 100]
    );

    await db.run(
        `INSERT INTO exam_marks (id, exam_id, student_id, marks_obtained, remarks) VALUES (?, ?, ?, ?, ?) ON CONFLICT(exam_id, student_id) DO NOTHING`,
        ['mrk_demo_1', 'exm_demo_1', 'std_1', 92.5, 'Top performer in class']
    );

    // Notifications
    await db.run(
        `INSERT INTO notifications (id, user_id, type, title, message) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
        ['ntf_demo_1', 'usr_student_1', 'announcement', 'Welcome to SmartSlate!', 'Your digital notebook is offline-first. Notes and drawings sync automatically with the Raspberry Pi server.']
    );

    console.log('[Seed] Seeding completed successfully!');
}

seed().catch(err => {
    console.error('[Seed Error]', err);
    process.exit(1);
});
