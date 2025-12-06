const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { isCliente } = require('../middleware/clientMiddleware');

// All cart routes are protected and for clients only
router.use(protect, isCliente);

router.route('/').get(getCart).post(addToCart);

router.route('/items/:productId').delete(removeFromCart).put(updateCartItem);

module.exports = router;
