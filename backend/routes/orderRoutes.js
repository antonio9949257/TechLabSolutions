const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Reglas de validación para crear una orden
const orderValidationRules = [
  check('orderItems', 'Los artículos de la orden son obligatorios').isArray({ min: 1 }),
  check('orderItems.*.name', 'El nombre del artículo es obligatorio').not().isEmpty(),
  check('orderItems.*.qty', 'La cantidad debe ser un número').isNumeric({ gt: 0 }),
  check('orderItems.*.price', 'El precio debe ser un número').isNumeric(),
];

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API para la gestión de órdenes
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     qty:
 *                       type: number
 *                     price:
 *                       type: number
 *                     product:
 *                       type: string
 *                     service:
 *                       type: string
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */
router.route('/').post(protect, orderValidationRules, createOrder);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Obtiene las órdenes del usuario actual
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de las órdenes del usuario
 */
router.route('/myorders').get(protect, getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       404:
 *         description: Orden no encontrada
 */
router.route('/:id').get(protect, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Actualiza el estado de una orden (solo Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, en proceso, completado, cancelado]
 *     responses:
 *       200:
 *         description: Estado de la orden actualizado
 */
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
