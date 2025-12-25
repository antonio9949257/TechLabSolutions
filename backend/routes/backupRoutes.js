const express = require('express');
const router = express.Router();
const { 
  exportDatabase,
  listBackups,
  importDatabase,
  downloadBackup,
  deleteBackup,
} = require('../controllers/backupController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

// All routes in this file are protected and for admins only
router.use(protect, adminProtect);

// @route   GET /api/backup
// @desc    List all available backups
router.get('/', listBackups);

// @route   POST /api/backup/export
// @desc    Export (dump) the database
router.post('/export', exportDatabase);

// @route   POST /api/backup/import/:filename
// @desc    Import (restore) a database backup
router.post('/import/:filename', importDatabase);

// @route   GET /api/backup/download/:filename
// @desc    Download a specific backup file
router.get('/download/:filename', downloadBackup);

// @route   DELETE /api/backup/:filename
// @desc    Delete a specific backup file
router.delete('/:filename', deleteBackup);

module.exports = router;

