const { getDB } = require('../config/db');

async function processBatchSync(req, res, next) {
    try {
        const { clientId, items } = req.body; // items: [{ id, entityType, entityId, action, payload, timestamp }]
        if (!Array.isArray(items) || items.length === 0) {
            return res.json({ message: 'No items to sync', processed: [] });
        }

        const db = await getDB();
        const processed = [];
        const conflicts = [];

        for (const item of items) {
            try {
                const { entityType, entityId, action, payload } = item;
                const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

                if (entityType === 'notes') {
                    if (action === 'CREATE' || action === 'UPDATE') {
                        const existing = await db.get(`SELECT updated_at FROM notes WHERE id = ?`, [entityId]);
                        if (!existing) {
                            await db.run(
                                `INSERT INTO notes (id, user_id, subject_id, folder, title, content, tags, attachments, is_favorite, updated_at) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [
                                    entityId,
                                    req.user.id,
                                    data.subjectId || data.subject_id || null,
                                    data.folder || 'General',
                                    data.title || 'Untitled Note',
                                    data.content || '',
                                    JSON.stringify(data.tags || []),
                                    JSON.stringify(data.attachments || []),
                                    data.isFavorite || data.is_favorite ? 1 : 0,
                                    data.updated_at || new Date().toISOString()
                                ]
                            );
                        } else {
                            // Latest modification wins
                            await db.run(
                                `UPDATE notes SET 
                                    title = COALESCE(?, title),
                                    content = COALESCE(?, content),
                                    subject_id = COALESCE(?, subject_id),
                                    folder = COALESCE(?, folder),
                                    tags = COALESCE(?, tags),
                                    is_favorite = COALESCE(?, is_favorite),
                                    updated_at = ?
                                 WHERE id = ? AND user_id = ?`,
                                [
                                    data.title,
                                    data.content,
                                    data.subjectId || data.subject_id,
                                    data.folder,
                                    data.tags ? JSON.stringify(data.tags) : null,
                                    typeof data.isFavorite === 'boolean' ? (data.isFavorite ? 1 : 0) : null,
                                    data.updated_at || new Date().toISOString(),
                                    entityId,
                                    req.user.id
                                ]
                            );
                        }
                    } else if (action === 'DELETE') {
                        await db.run(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [entityId, req.user.id]);
                    }
                } else if (entityType === 'drawings') {
                    if (action === 'CREATE' || action === 'UPDATE') {
                        const canvasStr = typeof data.canvasData === 'object' ? JSON.stringify(data.canvasData) : (data.canvas_data || '');
                        await db.run(
                            `INSERT INTO drawings (id, user_id, subject_id, title, canvas_data, preview_img, width, height, updated_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                             ON CONFLICT(id) DO UPDATE SET
                                title = excluded.title,
                                canvas_data = excluded.canvas_data,
                                preview_img = excluded.preview_img,
                                updated_at = excluded.updated_at`,
                            [
                                entityId,
                                req.user.id,
                                data.subjectId || null,
                                data.title || 'Untitled Drawing',
                                canvasStr,
                                data.previewImg || null,
                                data.width || 1200,
                                data.height || 800,
                                data.updated_at || new Date().toISOString()
                            ]
                        );
                    } else if (action === 'DELETE') {
                        await db.run(`DELETE FROM drawings WHERE id = ? AND user_id = ?`, [entityId, req.user.id]);
                    }
                }

                processed.push(item.id);
            } catch (err) {
                console.error('[Sync Item Error]', err);
                conflicts.push({ id: item.id, error: err.message });
            }
        }

        res.json({
            message: `Batch sync complete. Processed ${processed.length} items.`,
            processed,
            conflicts
        });
    } catch (err) {
        next(err);
    }
}

async function getSyncStatus(req, res, next) {
    try {
        const db = await getDB();
        const noteCount = await db.get(`SELECT COUNT(*) as count FROM notes WHERE user_id = ?`, [req.user.id]);
        const drawingCount = await db.get(`SELECT COUNT(*) as count FROM drawings WHERE user_id = ?`, [req.user.id]);

        res.json({
            serverTime: new Date().toISOString(),
            status: 'online',
            stats: {
                notes: noteCount ? noteCount.count : 0,
                drawings: drawingCount ? drawingCount.count : 0
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    processBatchSync,
    getSyncStatus
};
