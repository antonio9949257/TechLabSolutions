const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Can be null if system generated
    },
    type: {
      type: String,
      required: true,
      enum: ['order_update', 'new_message', 'system_alert', 'service_history_update', 'quote_update'],
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // Optional link to navigate to
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
