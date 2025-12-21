const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // Each user has only one cart
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'items.itemType', // Dynamic reference
        },
        itemType: {
          type: String,
          required: true,
          enum: ['Product', 'Service'],
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);
