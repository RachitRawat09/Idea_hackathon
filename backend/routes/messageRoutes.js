const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth');

// Initiate conversation (default message, pending status) and notify via email
router.post('/initiate', authMiddleware, messageController.initiateConversation);

// Accept conversation
router.post('/conversations/:conversationId/accept', authMiddleware, messageController.acceptConversation);

// List conversations
router.get('/conversations', authMiddleware, messageController.getConversations);

// Send a message (only accepted conversations)
router.post('/', authMiddleware, messageController.sendMessage);

// Get messages between two users (optionally filtered by listing)
router.get('/', authMiddleware, messageController.getMessages);

module.exports = router;