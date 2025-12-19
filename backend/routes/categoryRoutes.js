const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation rules for category creation
const categoryValidationRules = [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
];

router
  .route('/')
  .get(getCategories)
  .post(protect, admin, categoryValidationRules, createCategory);

router
  .route('/:id')
  .get(getCategoryById)
  .put(protect, admin, categoryValidationRules, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
