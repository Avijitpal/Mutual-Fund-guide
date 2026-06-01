const express = require('express');
const router = express.Router();
const { handleContextualChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Secure the endpoint so only logged-in account profiles can chat with your bot
router.post('/talk', protect, handleContextualChat);

module.exports = router;