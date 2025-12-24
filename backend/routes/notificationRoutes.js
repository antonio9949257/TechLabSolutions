const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware'); // Import adminProtect
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendNotificationToUsers, // Import new function
} = require('../controllers/notificationController');

module.exports = (io) => { // Export a function that takes io as an argument
  /**
   * @swagger
   * tags:
   *   name: Notifications
   *   description: API para la gestión de notificaciones de usuario
   */

  /**
   * @swagger
   * /api/notifications/send:
   *   post:
   *     summary: Envía una notificación a usuarios (solo administradores)
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *               - recipient
   *             properties:
   *               message:
   *                 type: string
   *               link:
   *                 type: string
   *               recipient:
   *                 type: string
   *                 description: 'ID del usuario o "all" para todos los usuarios'
   *     responses:
   *       200:
   *         description: Notificación enviada exitosamente
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso denegado (solo administradores)
   *       400:
   *         description: Error en la solicitud
   */
  router.post('/send', protect, adminProtect, (req, res) => sendNotificationToUsers(req, res, io)); // Pass io

  /**
   * @swagger
   * /api/notifications:
   *   get:
   *     summary: Obtiene todas las notificaciones del usuario autenticado
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de notificaciones
   *       401:
   *         description: No autorizado
   */
  router.get('/', protect, getNotifications);

  /**
   * @swagger
   * /api/notifications/{id}/read:
   *   put:
   *     summary: Marca una notificación específica como leída
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de la notificación a marcar como leída
   *     responses:
   *       200:
   *         description: Notificación marcada como leída
   *       401:
   *         description: No autorizado
   *       404:
   *         description: Notificación no encontrada
   */
  router.put('/:id/read', protect, markAsRead);

  /**
   * @swagger
   * /api/notifications/read-all:
   *   put:
   *     summary: Marca todas las notificaciones del usuario autenticado como leídas
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Todas las notificaciones marcadas como leídas
   *       401:
   *         description: No autorizado
   */
  router.put('/read-all', protect, markAllAsRead);

  return router;
};
