const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Reglas de validación para actualizar el perfil (opcionales)
const profileValidationRules = [
  check('name', 'El nombre no puede estar vacío').optional().not().isEmpty(),
  check('email', 'El email debe ser válido').optional().isEmail(),
];

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: API para la gestión del perfil de usuario
 */

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *   put:
 *     summary: Actualiza el perfil del usuario autenticado
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router
  .route('/')
  .get(protect, getMyProfile)
  .put(protect, upload.single('profilePicture'), updateMyProfile);

module.exports = router;
