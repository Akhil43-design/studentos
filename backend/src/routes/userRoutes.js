const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const { role } = req.query;
        const db = await getDB();
        
        let query = `SELECT id, username, email, full_name, role, avatar, created_at FROM users WHERE 1=1`;
        const params = [];
        
        if (role) {
            query += ` AND role = ?`;
            params.push(role);
        }
        
        query += ` ORDER BY full_name ASC`;
        const users = await db.all(query, params);
        res.json({ users });
    } catch (err) {
        next(err);
    }
});

router.get('/students', authenticateToken, async (req, res, next) => {
    try {
        const db = await getDB();
        const students = await db.all(
            `SELECT s.id as student_id, s.roll_number, s.class_id, u.id as user_id, u.full_name, u.email, c.name as class_name
             FROM students s
             JOIN users u ON s.user_id = u.id
             LEFT JOIN classes c ON s.class_id = c.id
             ORDER BY u.full_name ASC`
        );
        res.json({ students });
    } catch (err) {
        next(err);
    }
});

router.get('/subjects', authenticateToken, async (req, res, next) => {
    try {
        const db = await getDB();
        const subjects = await db.all(`SELECT * FROM subjects ORDER BY name ASC`);
        res.json({ subjects });
    } catch (err) {
        next(err);
    }
});

router.get('/classes', authenticateToken, async (req, res, next) => {
    try {
        const db = await getDB();
        const classes = await db.all(`SELECT * FROM classes ORDER BY grade, section ASC`);
        res.json({ classes });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
