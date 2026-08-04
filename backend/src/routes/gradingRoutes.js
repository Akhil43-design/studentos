const express = require('express');
const router = express.Router();

let pendingSubmissions = [
  {
    id: 'sub_1',
    studentName: 'Alex Johnson',
    rollNo: '101',
    assignmentTitle: 'Calculus Chapter 4 - Integration Proofs',
    subject: 'Mathematics',
    submittedAt: 'Today at 09:30 AM',
    status: 'pending_review',
    score: 92,
    maxScore: 100,
    noteSnippet: '∫ f(x)dx = F(b) - F(a) verified using the Fundamental Theorem of Calculus...'
  },
  {
    id: 'sub_2',
    studentName: 'Sarah Connor',
    rollNo: '102',
    assignmentTitle: 'Quantum Optics Lab Report',
    subject: 'Physics',
    submittedAt: 'Yesterday at 04:15 PM',
    status: 'pending_review',
    score: 88,
    maxScore: 100,
    noteSnippet: 'Light wave interference pattern diagrams and refractive index measurement logs...'
  }
];

router.get('/pending', (req, res) => {
  res.json({ submissions: pendingSubmissions });
});

router.post('/publish', (req, res) => {
  const { submissionId, score, feedback } = req.body;
  pendingSubmissions = pendingSubmissions.filter(s => s.id !== submissionId);
  res.json({ success: true, message: 'Grade published successfully' });
});

module.exports = router;
