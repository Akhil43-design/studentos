const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/attendance', reportController.exportAttendanceReport);
router.get('/marks', reportController.exportMarksReport);

module.exports = router;
