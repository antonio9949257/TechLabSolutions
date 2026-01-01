const express = require('express');
const router = express.Router();
const { createQuote, getQuotes, updateQuoteStatus } = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/quotes
// @desc    Create a new quote request
// @access  Public
router.post('/', createQuote);

// @route   GET /api/quotes
// @desc    Get all quote requests
// @access  Private/Admin
router.get('/', protect, admin, getQuotes);

// @route   PUT /api/quotes/:id/status
// @desc    Update quote status
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateQuoteStatus);

module.exports = router;
