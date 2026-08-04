const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', examController.getExams);
router.post('/', requireRole('teacher', 'admin'), examController.createExam);
router.post('/marks', requireRole('teacher', 'admin'), examController.recordMarks);
router.get('/student/:studentId', examController.getStudentMarks);

module.exports = router;
