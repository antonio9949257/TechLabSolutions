const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Service = require('../models/Service'); // Import Service model
const Kit = require('../models/Kit'); // Import Kit model

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private/Cliente
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.item');

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    // Filter out items that couldn't be populated (due to missing ref or bad data)
    const validItems = cart.items.filter(cartItem => cartItem.item);

    

    // Calculate total price based on valid items
    const totalPrice = validItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.json({ items: validItems, totalPrice });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private/Cliente
const addToCart = async (req, res) => {
  const { itemId, quantity, itemType } = req.body;

  if (!['Product', 'Service', 'Kit'].includes(itemType)) {
    return res.status(400).json({ message: 'Tipo de item inválido.' });
  }

  try {
    let item;
    if (itemType === 'Product') {
      item = await Product.findById(itemId);
    } else if (itemType === 'Service') {
      item = await Service.findById(itemId);
    } else if (itemType === 'Kit') {
      item = await Kit.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Cleanse cart of invalid items before processing
    cart.items = cart.items.filter(ci => ci.item && ci.itemType);

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        item: itemId,
        itemType,
        quantity,
        price: item.precio || item.price, // 'precio' for Product, 'price' for Service or Kit
      });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.item');
    res.status(201).json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private/Cliente
const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Filter out the item to be removed, and also any invalid items
    cart.items = cart.items.filter(
      (cartItem) => cartItem.item && cartItem.item.toString() !== itemId
    );

    await cart.save();
    const populatedCart = await cart.populate('items.item');
    res.json(populatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:itemId
// @access  Private/Cliente
const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return removeFromCart(req, res);
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    // Cleanse cart of invalid items before processing
    cart.items = cart.items.filter(ci => ci.item && ci.itemType);

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate('items.item');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private/Cliente
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Carrito vaciado exitosamente', items: [], totalPrice: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart, // Export clearCart
};
