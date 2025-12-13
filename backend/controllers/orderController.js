const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Cart = require('../models/Cart'); // Import Cart model

// @desc    Crear una nueva orden desde el carrito
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'nombre price stock');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'No hay artículos en el carrito' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.nombre,
      qty: item.quantity,
      price: item.product.price, // Use price from DB for security
    }));

    const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Check stock for all items before creating the order
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `No hay stock suficiente para ${item.product.nombre}` });
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Decrease stock for each product
    for (const item of order.orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.qty } });
    }

    // Clear the user's cart
    await Cart.deleteOne({ _id: cart._id });

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Obtener una orden por ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Asegurarse que solo el usuario de la orden o un admin puedan verla
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'No autorizado para ver esta orden' });
    }
    res.json(order);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
};

// @desc    Actualizar el estado de una orden
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        // Si el estado es 'completado', se podría manejar el pago aquí
        if (status === 'completado') {
            order.isPaid = true;
            order.paidAt = Date.now();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Orden no encontrada' });
    }
};

// @desc    Obtener las órdenes del usuario logueado
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};


module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
};
