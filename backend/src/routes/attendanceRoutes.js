const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', attendanceController.getAttendance);
router.post('/mark', requireRole('teacher', 'admin'), attendanceController.markAttendance);

module.exports = router;
