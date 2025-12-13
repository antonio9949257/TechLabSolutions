const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Reglas de validación para la creación de productos
const productValidationRules = [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
  check('precio', 'El precio debe ser un valor numérico').isFloat({ gt: 0 }),
  check('sku', 'El SKU es obligatorio y debe ser único').not().isEmpty(),
  check('stock', 'El stock debe ser un número entero').isInt({ gte: 0 }),
  check('categoria', 'La categoría es obligatoria').not().isEmpty(),
];

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API para la gestión de productos
 */

/**
 * @swagger
 * /api/products/export:
 *   get:
 *     summary: Exporta la lista de productos a un archivo XLSX
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo XLSX con los productos.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 */
router.route('/export').get(protect, admin, exportProducts);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Devuelve una lista de todos los productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra productos por categoría
 *     responses:
 *       200:
 *         description: La lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.route('/').get(getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               sku:
 *                 type: string
 *               stock:
 *                 type: number
 *               categoria:
 *                 type: string
 *               especificaciones:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: El producto fue creado exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error de validación en la solicitud
 */
router.route('/').post(protect, admin, upload.single('image'), productValidationRules, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Detalles del producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               sku:
 *                 type: string
 *               stock:
 *                 type: number
 *               categoria:
 *                 type: string
 *               especificaciones:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), productValidationRules, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
