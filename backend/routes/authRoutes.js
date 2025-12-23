const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import passport

router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: false }));
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware'); 

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API para la gestión de usuarios y autenticación
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [estudiante, instructor, administrador]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión para un usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/auth/google:
 *   get:
 *     summary: Inicia el flujo de autenticación con Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirecciona al proveedor Google
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/users/auth/google/callback:
 *   get:
 *     summary: Callback para el flujo de autenticación con Google
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Autenticación Google exitosa, devuelve token
 *       401:
 *         description: Fallo en la autenticación Google
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful authentication, redirect to frontend with token and user ID
    const token = req.user.token;
    const userId = req.user._id; // Only pass the user ID, not the full object

    // Redirect to frontend callback URL with token and user ID
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${userId}`);
  }
);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteMe);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios (solo administradores)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (solo administradores)
 */
router.get('/', protect, adminProtect, getAllUsers); // Get all users

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario (solo administradores)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [cliente, admin]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', protect, adminProtect, createUser); // Create user

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente (solo administradores)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [cliente, admin]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', protect, adminProtect, updateUser); // Update user

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario (solo administradores)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', protect, adminProtect, deleteUser); // Delete user

module.exports = router;
