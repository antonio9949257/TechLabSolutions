const express = require('express');
const router = express.Router();
const {
  getHomeSections,
  getAdminHomeSections,
  updateHomeSectionsOrder,
  updateHomeSection,
  seedHomeSections,
} = require('../controllers/homeSectionController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadToMinio } = require('../middleware/uploadMiddleware');

// Public route
router.get('/', getHomeSections);

// Admin routes
router.get('/admin', protect, admin, getAdminHomeSections);
router.put('/admin/order', protect, admin, updateHomeSectionsOrder);
router.put(
  '/admin/:id',
  protect,
  admin,
  upload.single('image'), // 'image' is the field name for the file upload
  uploadToMinio(process.env.MINIO_BUCKET_NAME),
  updateHomeSection
);
router.post('/admin/seed', protect, admin, seedHomeSections);

module.exports = router;
