const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');
const { generateToken } = require('../config/jwt');

async function register(req, res, next) {
    try {
        const { username, email, password, pin, fullName, role, rollNumber, classId, employeeId, phone } = req.body;
        
        if (!username || !email || (!password && !pin) || !fullName || !role) {
            return res.status(400).json({ error: 'Missing required fields (username, email, password/pin, fullName, role)' });
        }

        const db = await getDB();
        
        // Check duplicate
        const existing = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash(pin, 10);
        const pinHash = pin ? await bcrypt.hash(pin, 10) : await bcrypt.hash('1234', 10);

        await db.run(
            `INSERT INTO users (id, username, email, password_hash, pin_hash, full_name, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, username, email, passwordHash, pinHash, fullName, role]
        );

        // Role specific profile
        if (role === 'student') {
            const studentId = 'std_' + Date.now();
            const roll = rollNumber || 'ROLL-' + Math.floor(1000 + Math.random() * 9000);
            const cId = classId || 'cls_10A';
            await db.run(`INSERT INTO students (id, user_id, roll_number, class_id) VALUES (?, ?, ?, ?)`, [studentId, userId, roll, cId]);
        } else if (role === 'teacher') {
            const teacherId = 'tch_' + Date.now();
            const empId = employeeId || 'EMP-' + Math.floor(1000 + Math.random() * 9000);
            await db.run(`INSERT INTO teachers (id, user_id, employee_id, department) VALUES (?, ?, ?, ?)`, [teacherId, userId, empId, 'Science & Tech']);
        } else if (role === 'parent') {
            const parentId = 'prn_' + Date.now();
            await db.run(`INSERT INTO parents (id, user_id, phone) VALUES (?, ?, ?)`, [parentId, userId, phone || '']);
        }

        const token = generateToken({ id: userId, username, role, fullName });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, username, email, fullName, role }
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { username, password, pin } = req.body;

        if (!username || (!password && !pin)) {
            return res.status(400).json({ error: 'Please provide username/email and either Password or PIN' });
        }

        const db = await getDB();
        const user = await db.get(
            `SELECT * FROM users WHERE username = ? OR email = ?`,
            [username, username]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        let isMatch = false;
        if (pin && user.pin_hash) {
            isMatch = await bcrypt.compare(pin, user.pin_hash);
        } else if (password && user.password_hash) {
            isMatch = await bcrypt.compare(password, user.password_hash);
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid PIN or Password' });
        }

        // Fetch detailed profile info if available
        let profileExtra = {};
        if (user.role === 'student') {
            const std = await db.get(`SELECT * FROM students WHERE user_id = ?`, [user.id]);
            if (std) profileExtra = { studentId: std.id, rollNumber: std.roll_number, classId: std.class_id, parentUserId: std.parent_user_id };
        } else if (user.role === 'teacher') {
            const tch = await db.get(`SELECT * FROM teachers WHERE user_id = ?`, [user.id]);
            if (tch) profileExtra = { teacherId: tch.id, employeeId: tch.employee_id, department: tch.department };
        }

        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.full_name,
            ...profileExtra
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                avatar: user.avatar,
                ...profileExtra
            }
        });
    } catch (err) {
        next(err);
    }
}

async function forgotPin(req, res, next) {
    try {
        const { username, email, newPin } = req.body;
        if (!username || !email || !newPin || newPin.length !== 4) {
            return res.status(400).json({ error: 'Username, email, and 4-digit new PIN required' });
        }

        const db = await getDB();
        const user = await db.get(`SELECT id FROM users WHERE username = ? AND email = ?`, [username, email]);
        if (!user) {
            return res.status(404).json({ error: 'User with matching username and email not found' });
        }

        const newPinHash = await bcrypt.hash(newPin, 10);
        await db.run(`UPDATE users SET pin_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [newPinHash, user.id]);

        res.json({ message: 'PIN reset successfully. You can now log in with your new PIN.' });
    } catch (err) {
        next(err);
    }
}

async function getProfile(req, res, next) {
    try {
        const db = await getDB();
        const user = await db.get(`SELECT id, username, email, full_name, role, avatar, created_at FROM users WHERE id = ?`, [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    forgotPin,
    getProfile
};
