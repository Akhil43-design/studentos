function errorHandler(err, req, res, next) {
    console.error('[Error Handler]', err);
    
    if (err.message && err.message.includes('not supported')) {
        return res.status(400).json({ error: err.message });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds allowed limit' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
}

module.exports = errorHandler;
