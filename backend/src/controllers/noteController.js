const { getDB } = require('../config/db');

async function getNotes(req, res, next) {
    try {
        const { search, subjectId, folder, favorite, sortBy = 'updated_at', order = 'DESC' } = req.query;
        const db = await getDB();

        let query = `
            SELECT n.*, s.name as subject_name, s.color as subject_color 
            FROM notes n
            LEFT JOIN subjects s ON n.subject_id = s.id
            WHERE n.user_id = ?
        `;
        const params = [req.user.id];

        if (search) {
            query += ` AND (n.title LIKE ? OR n.content LIKE ? OR n.tags LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (subjectId) {
            query += ` AND n.subject_id = ?`;
            params.push(subjectId);
        }

        if (folder) {
            query += ` AND n.folder = ?`;
            params.push(folder);
        }

        if (favorite === 'true' || favorite === '1') {
            query += ` AND n.is_favorite = 1`;
        }

        const validSortColumns = ['updated_at', 'created_at', 'title', 'subject_name'];
        const sortCol = validSortColumns.includes(sortBy) ? sortBy : 'updated_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY n.${sortCol} ${sortOrder}`;

        const notes = await db.all(query, params);
        
        // Parse JSON tags & attachments
        const formattedNotes = notes.map(n => ({
            ...n,
            tags: n.tags ? JSON.parse(n.tags) : [],
            attachments: n.attachments ? JSON.parse(n.attachments) : [],
            is_favorite: !!n.is_favorite
        }));

        res.json({ notes: formattedNotes });
    } catch (err) {
        next(err);
    }
}

async function getNoteById(req, res, next) {
    try {
        const db = await getDB();
        const note = await db.get(
            `SELECT n.*, s.name as subject_name, s.color as subject_color 
             FROM notes n 
             LEFT JOIN subjects s ON n.subject_id = s.id 
             WHERE n.id = ? AND n.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        note.tags = note.tags ? JSON.parse(note.tags) : [];
        note.attachments = note.attachments ? JSON.parse(note.attachments) : [];
        note.is_favorite = !!note.is_favorite;

        res.json({ note });
    } catch (err) {
        next(err);
    }
}

async function createNote(req, res, next) {
    try {
        const { id, title, content, subjectId, folder, tags, attachments, isFavorite } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Note title is required' });
        }

        const noteId = id || 'nte_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const db = await getDB();

        await db.run(
            `INSERT INTO notes (id, user_id, subject_id, folder, title, content, tags, attachments, is_favorite, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                noteId,
                req.user.id,
                subjectId || null,
                folder || 'General',
                title,
                content || '',
                JSON.stringify(tags || []),
                JSON.stringify(attachments || []),
                isFavorite ? 1 : 0
            ]
        );

        const created = await db.get(`SELECT * FROM notes WHERE id = ?`, [noteId]);
        res.status(201).json({ message: 'Note created successfully', note: created });
    } catch (err) {
        next(err);
    }
}

async function updateNote(req, res, next) {
    try {
        const { title, content, subjectId, folder, tags, attachments, isFavorite } = req.body;
        const noteId = req.params.id;
        const db = await getDB();

        const note = await db.get(`SELECT * FROM notes WHERE id = ? AND user_id = ?`, [noteId, req.user.id]);
        if (!note) {
            return res.status(404).json({ error: 'Note not found or permission denied' });
        }

        await db.run(
            `UPDATE notes SET 
                title = COALESCE(?, title),
                content = COALESCE(?, content),
                subject_id = COALESCE(?, subject_id),
                folder = COALESCE(?, folder),
                tags = COALESCE(?, tags),
                attachments = COALESCE(?, attachments),
                is_favorite = COALESCE(?, is_favorite),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [
                title,
                content,
                subjectId,
                folder,
                tags ? JSON.stringify(tags) : null,
                attachments ? JSON.stringify(attachments) : null,
                typeof isFavorite === 'boolean' ? (isFavorite ? 1 : 0) : null,
                noteId,
                req.user.id
            ]
        );

        const updated = await db.get(`SELECT * FROM notes WHERE id = ?`, [noteId]);
        res.json({ message: 'Note updated successfully', note: updated });
    } catch (err) {
        next(err);
    }
}

async function deleteNote(req, res, next) {
    try {
        const db = await getDB();
        const result = await db.run(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully', id: req.params.id });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
