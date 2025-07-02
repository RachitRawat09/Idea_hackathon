const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth');

// Send a message
router.post('/', authMiddleware, messageController.sendMessage);
// Get messages between two users (optionally filtered by listing)
router.get('/', authMiddleware, messageController.getMessages);

module.exports = router; 