const { getDB } = require('../config/db');

async function getNotifications(req, res, next) {
    try {
        const db = await getDB();
        const notifications = await db.all(
            `SELECT * FROM notifications 
             WHERE user_id = ? OR user_id = 'ALL' OR user_id = ?
             ORDER BY created_at DESC LIMIT 50`,
            [req.user.id, req.user.role.toUpperCase()]
        );

        const unreadCount = notifications.filter(n => !n.is_read).length;
        res.json({ notifications, unreadCount });
    } catch (err) {
        next(err);
    }
}

async function markNotificationRead(req, res, next) {
    try {
        const { id } = req.params;
        const db = await getDB();

        if (id === 'all') {
            await db.run(`UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id = 'ALL'`, [req.user.id]);
            return res.json({ message: 'All notifications marked as read' });
        }

        await db.run(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications,
    markNotificationRead
};
