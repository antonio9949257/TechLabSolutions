const mongoose = require('mongoose');

const KitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Por favor, agrega un nombre para el kit'],
    },
    description: {
      type: String,
      required: [true, 'Por favor, agrega una descripción para el kit'],
    },
    price: {
      type: Number,
      required: [true, 'Por favor, agrega un precio para el kit'],
      default: 0.0,
    },
    discountPercentage: {
      type: Number,
      required: false,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        priceAtTimeOfAddition: {
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

module.exports = mongoose.model('Kit', KitSchema);
