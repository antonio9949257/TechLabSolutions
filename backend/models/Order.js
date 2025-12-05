const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        // Un item puede ser un producto o un servicio
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
        }
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
        type: String,
        required: true,
        enum: ['pendiente', 'en proceso', 'completado', 'cancelado'],
        default: 'pendiente',
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentResult: {
        // Este objeto almacenará la respuesta de la pasarela de pago (ej. Stripe)
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
