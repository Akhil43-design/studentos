-- SmartSlate SQLite Database Schema

PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'parent', 'admin')) NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#38BDF8',
    description TEXT
);

-- Classes / Sections table
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL
);

-- Students profile table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    class_id TEXT NOT NULL,
    parent_user_id TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(class_id) REFERENCES classes(id),
    FOREIGN KEY(parent_user_id) REFERENCES users(id)
);

-- Teachers profile table
CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parents profile table
CREATE TABLE IF NOT EXISTS parents (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    phone TEXT,
    occupation TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teacher Subject Class Assignments
CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    PRIMARY KEY(teacher_id, subject_id, class_id),
    FOREIGN KEY(teacher_id) REFERENCES teachers(id),
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(class_id) REFERENCES classes(id)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject_id TEXT,
    folder TEXT DEFAULT 'General',
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT, -- JSON array string
    attachments TEXT, -- JSON array string
    is_favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- Drawings table
CREATE TABLE IF NOT EXISTS drawings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject_id TEXT,
    title TEXT NOT NULL,
    canvas_data TEXT NOT NULL, -- JSON string containing paths/shapes/background
    preview_img TEXT, -- Base64 thumbnail or URL
    width INTEGER DEFAULT 1200,
    height INTEGER DEFAULT 800,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    due_date DATETIME NOT NULL,
    max_marks INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(teacher_id) REFERENCES teachers(id),
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(class_id) REFERENCES classes(id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    file_path TEXT,
    note_id TEXT,
    drawing_id TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('submitted', 'approved', 'rejected', 'resubmit')) DEFAULT 'submitted',
    marks INTEGER,
    feedback TEXT,
    FOREIGN KEY(assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    student_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    subject_id TEXT,
    status TEXT CHECK(status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
    remarks TEXT,
    recorded_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, student_id, subject_id),
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(class_id) REFERENCES classes(id),
    FOREIGN KEY(recorded_by) REFERENCES users(id)
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    exam_date DATE NOT NULL,
    max_marks INTEGER DEFAULT 100,
    FOREIGN KEY(subject_id) REFERENCES subjects(id),
    FOREIGN KEY(class_id) REFERENCES classes(id)
);

-- Exam Marks table
CREATE TABLE IF NOT EXISTS exam_marks (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    marks_obtained REAL NOT NULL,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id),
    FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES students(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, -- Target user or 'ALL' / role string
    type TEXT NOT NULL, -- 'assignment', 'attendance', 'exam', 'announcement'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sync Queue (for backend tracking of client sync requests)
CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    payload TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
