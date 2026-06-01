const express = require('express');
const router = express.Router();
const { buyFund, getUserPortfolio, toggleSipStatus } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware'); // Use your existing JWT protection layer

router.post('/buy', protect, buyFund);
router.get('/summary', protect, getUserPortfolio);
router.post('/toggle-sip', protect, toggleSipStatus);

module.exports = router;