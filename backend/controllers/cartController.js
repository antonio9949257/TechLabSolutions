const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private/Cliente
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image'
    );

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.json({ items: cart.items, totalPrice });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private/Cliente
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // If cart doesn't exist, create a new one
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // Check if product is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // If product exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private/Cliente
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:productId
// @access  Private/Cliente
const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return removeFromCart(req, res);
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
};
