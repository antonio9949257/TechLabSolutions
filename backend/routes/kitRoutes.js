const express = require('express');
const router = express.Router();
const {
  createKit,
  getKits,
  getKit, // Import getKit
  deleteKit,
  updateKit,
} = require('../controllers/kitController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For image uploads

router.route('/')
  .post(protect, admin, upload.single('image'), createKit) // 'image' is the field name for the file upload
  .get(getKits);

router.route('/:id')
  .get(getKit) // Add route to get a single kit
  .delete(protect, admin, deleteKit)
  .put(protect, admin, upload.single('image'), updateKit); // 'image' is the field name for the file upload

module.exports = router;
