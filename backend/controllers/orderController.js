const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Service = require('../models/Service');

// @desc    Crear una nueva orden
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No hay artículos en la orden' });
  }

  // Lógica para calcular el precio total en el backend
  let totalPrice = 0;
  for (const item of orderItems) {
    // Aquí se podría verificar el precio contra la BD
    totalPrice += item.price * item.qty;
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Aquí se podría descontar el stock de los productos
  
  res.status(201).json(createdOrder);
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
