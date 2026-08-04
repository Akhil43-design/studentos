const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/batch', syncController.processBatchSync);
router.get('/status', syncController.getSyncStatus);

module.exports = router;
