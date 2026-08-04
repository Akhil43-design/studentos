const express = require('express');
const router = express.Router();

let sampleChatMessages = [
  {
    id: 1,
    sender: 'Prof. Davis',
    avatar: 'D',
    time: '10:15 AM',
    text: 'Good morning everyone! Please review Chapter 4 calculus integration proofs before tomorrow\'s active exam.',
    role: 'teacher',
    isMe: false,
  },
  {
    id: 2,
    sender: 'Sarah Connor',
    avatar: 'S',
    time: '10:18 AM',
    text: 'Thanks Professor! Does anyone have the handwritten formula notebook from yesterday\'s lecture?',
    role: 'student',
    isMe: false,
  }
];

router.get('/messages', (req, res) => {
  res.json({ messages: sampleChatMessages });
});

router.post('/send', (req, res) => {
  const { text, attachment, sender } = req.body;
  const newMsg = {
    id: Date.now(),
    sender: sender || 'User',
    avatar: (sender || 'U').charAt(0),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: text || '',
    attachment: attachment || null,
    role: 'student',
    isMe: true
  };
  sampleChatMessages.push(newMsg);
  res.json({ success: true, message: newMsg });
});

module.exports = router;
