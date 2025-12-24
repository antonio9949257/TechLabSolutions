const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @access  Private/Admin
router.get('/stats', protect, admin, getStats);

module.exports = router;
