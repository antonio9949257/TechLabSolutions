const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  likeProject,
  addComment,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.route('/').get(getAllProjects);
router.route('/:id').get(getProjectById);

// Admin routes
router.route('/').post(protect, admin, upload.single('image'), createProject);
router
  .route('/:id')
  .put(protect, admin, upload.single('image'), updateProject)
  .delete(protect, admin, deleteProject);

// Authenticated user routes
router.route('/:id/like').put(protect, likeProject);
router.route('/:id/comment').post(protect, addComment);

module.exports = router;
