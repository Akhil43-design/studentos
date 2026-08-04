const { getDB } = require('../config/db');

async function getDrawings(req, res, next) {
    try {
        const { search, subjectId } = req.query;
        const db = await getDB();

        let query = `
            SELECT d.*, s.name as subject_name 
            FROM drawings d
            LEFT JOIN subjects s ON d.subject_id = s.id
            WHERE d.user_id = ?
        `;
        const params = [req.user.id];

        if (search) {
            query += ` AND d.title LIKE ?`;
            params.push(`%${search}%`);
        }

        if (subjectId) {
            query += ` AND d.subject_id = ?`;
            params.push(subjectId);
        }

        query += ` ORDER BY d.updated_at DESC`;

        const drawings = await db.all(query, params);
        
        const formatted = drawings.map(d => ({
            ...d,
            canvas_data: typeof d.canvas_data === 'string' ? JSON.parse(d.canvas_data) : d.canvas_data
        }));

        res.json({ drawings: formatted });
    } catch (err) {
        next(err);
    }
}

async function getDrawingById(req, res, next) {
    try {
        const db = await getDB();
        const drawing = await db.get(
            `SELECT d.*, s.name as subject_name FROM drawings d LEFT JOIN subjects s ON d.subject_id = s.id WHERE d.id = ? AND d.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (!drawing) {
            return res.status(404).json({ error: 'Drawing not found' });
        }

        drawing.canvas_data = JSON.parse(drawing.canvas_data);
        res.json({ drawing });
    } catch (err) {
        next(err);
    }
}

async function createDrawing(req, res, next) {
    try {
        const { id, title, canvasData, previewImg, subjectId, width, height } = req.body;
        if (!title || !canvasData) {
            return res.status(400).json({ error: 'Title and canvasData are required' });
        }

        const drawingId = id || 'drw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const db = await getDB();

        const canvasStr = typeof canvasData === 'object' ? JSON.stringify(canvasData) : canvasData;

        await db.run(
            `INSERT INTO drawings (id, user_id, subject_id, title, canvas_data, preview_img, width, height, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                drawingId,
                req.user.id,
                subjectId || null,
                title,
                canvasStr,
                previewImg || null,
                width || 1200,
                height || 800
            ]
        );

        const created = await db.get(`SELECT * FROM drawings WHERE id = ?`, [drawingId]);
        res.status(201).json({ message: 'Drawing saved successfully', drawing: created });
    } catch (err) {
        next(err);
    }
}

async function updateDrawing(req, res, next) {
    try {
        const { title, canvasData, previewImg, subjectId } = req.body;
        const drawingId = req.params.id;
        const db = await getDB();

        const canvasStr = canvasData ? (typeof canvasData === 'object' ? JSON.stringify(canvasData) : canvasData) : null;

        await db.run(
            `UPDATE drawings SET 
                title = COALESCE(?, title),
                canvas_data = COALESCE(?, canvas_data),
                preview_img = COALESCE(?, preview_img),
                subject_id = COALESCE(?, subject_id),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [title, canvasStr, previewImg, subjectId, drawingId, req.user.id]
        );

        const updated = await db.get(`SELECT * FROM drawings WHERE id = ?`, [drawingId]);
        res.json({ message: 'Drawing updated successfully', drawing: updated });
    } catch (err) {
        next(err);
    }
}

async function deleteDrawing(req, res, next) {
    try {
        const db = await getDB();
        const result = await db.run(`DELETE FROM drawings WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Drawing not found' });
        }

        res.json({ message: 'Drawing deleted successfully', id: req.params.id });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getDrawings,
    getDrawingById,
    createDrawing,
    updateDrawing,
    deleteDrawing
};
