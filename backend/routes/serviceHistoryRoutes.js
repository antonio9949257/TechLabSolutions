const express = require('express');
const router = express.Router();
const {
  createServiceHistory,
  getAllServiceHistory,
  getServiceHistoryById,
  updateServiceHistory,
  deleteServiceHistory,
  likeServiceHistory,
  addCommentServiceHistory,
  incrementViewServiceHistory,
} = require('../controllers/serviceHistoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getAllServiceHistory);
router.route('/:id').get(getServiceHistoryById);
router.route('/:id/view').post(incrementViewServiceHistory);

// Admin routes
router.route('/').post(protect, admin, upload.single('image'), createServiceHistory);
router
  .route('/:id')
  .put(protect, admin, upload.single('image'), updateServiceHistory)
  .delete(protect, admin, deleteServiceHistory);

// Authenticated user routes
router.route('/:id/like').put(protect, likeServiceHistory);
router.route('/:id/comment').post(protect, addCommentServiceHistory);

module.exports = router;
