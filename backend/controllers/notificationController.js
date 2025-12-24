const Notification = require('../models/Notification');
const User = require('../models/User'); // Import User model

// @desc    Get notifications for authenticated user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profilePicture'); // Populate sender info
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificación como leída', error: error.message });
  }
};

// @desc    Mark all notifications as read for authenticated user
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar todas las notificaciones como leídas', error: error.message });
  }
};

// @desc    Create a new notification (for internal use, e.g., by other controllers)
// @access  Private (should be called internally or by admin-protected routes)
const createNotification = async ({ recipient, sender, type, message, link }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      link,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Could not create notification');
  }
};

// @desc    Send notifications to users (admin only)
// @route   POST /api/notifications/send
// @access  Private/Admin
const sendNotificationToUsers = async (req, res, io) => { // Accept io as a parameter
  const { message, link, recipient } = req.body; // recipient can be 'all' or a specific userId

  if (!message) {
    return res.status(400).json({ message: 'El mensaje de la notificación es requerido.' });
  }

  try {
    let recipients = [];
    if (recipient === 'all') {
      const allUsers = await User.find({});
      recipients = allUsers.map(user => user._id);
    } else if (recipient) {
      recipients.push(recipient); // Assuming recipient is a valid user ID
    } else {
      return res.status(400).json({ message: 'El destinatario de la notificación es requerido.' });
    }

    const createdNotifications = [];
    for (const recId of recipients) {
      const newNotification = await createNotification({
        recipient: recId,
        sender: req.user._id, // Admin sending the notification
        type: 'system_alert', // Default type for admin-sent notifications
        message,
        link,
      });
      createdNotifications.push(newNotification);

      // Emit notification via WebSocket to the recipient's room
      io.to(recId.toString()).emit('newNotification', newNotification);
    }

    res.status(200).json({ message: 'Notificaciones enviadas exitosamente', notifications: createdNotifications });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Error interno del servidor al enviar notificaciones', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  sendNotificationToUsers,
};
