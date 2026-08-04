const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken);

router.get('/', assignmentController.getAssignments);
router.post('/', requireRole('teacher', 'admin'), upload.single('file'), assignmentController.createAssignment);
router.post('/submit', requireRole('student'), upload.single('file'), assignmentController.submitAssignment);
router.get('/:assignmentId/submissions', requireRole('teacher', 'admin'), assignmentController.getSubmissions);
router.put('/submissions/:submissionId/grade', requireRole('teacher', 'admin'), assignmentController.gradeSubmission);

module.exports = router;
