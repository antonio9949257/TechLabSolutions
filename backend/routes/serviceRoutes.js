const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Reglas de validación para crear/actualizar un servicio
const serviceValidationRules = [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('description', 'La descripción es obligatoria').not().isEmpty(),
  check('price', 'El precio debe ser un valor numérico').isFloat({ gt: 0 }),
  check('category', 'La categoría es obligatoria').not().isEmpty(),
  check('availability', 'La disponibilidad debe ser un valor booleano').optional().isBoolean(),
];

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API para la gestión de servicios
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Devuelve una lista de todos los servicios
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtra servicios por categoría
 *     responses:
 *       200:
 *         description: La lista de servicios
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               availability:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       401:
 *         description: No autorizado
 */
router
  .route('/')
  .get(getServices)
  .post(protect, admin, serviceValidationRules, createService);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtiene un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del servicio
 *     responses:
 *       200:
 *         description: Detalles del servicio
 *       404:
 *         description: Servicio no encontrado
 *   put:
 *     summary: Actualiza un servicio por ID
 *     tags: [Services]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *       404:
 *         description: Servicio no encontrado
 *   delete:
 *     summary: Elimina un servicio por ID
 *     tags: [Services]
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
 *         description: Servicio eliminado
 *       404:
 *         description: Servicio no encontrado
 */
router
  .route('/:id')
  .get(getServiceById)
  .put(protect, admin, serviceValidationRules, updateService)
  .delete(protect, admin, deleteService);

module.exports = router;
