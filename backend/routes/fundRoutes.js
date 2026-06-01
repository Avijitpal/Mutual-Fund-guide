const express = require('express');
const router = express.Router();
const { getAllFunds, seedFunds, getFundById, getFundHistory} = require('../controllers/fundController');
const { cacheFunds } = require('../middleware/cacheMiddleware');

// Define API routing maps
router.get('/', getAllFunds);
router.post('/seed', seedFunds);
router.get('/:id', getFundById);
router.get('/:id/history', getFundHistory);
router.get('/', cacheFunds, getAllFunds);

module.exports = router;