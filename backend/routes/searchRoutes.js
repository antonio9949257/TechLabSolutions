const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// @route   GET /api/search
// @desc    Search for products and services
// @access  Public
router.get('/', searchController.search);

module.exports = router;
