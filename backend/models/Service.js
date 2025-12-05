const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, añade un nombre para el servicio'],
    },
    description: {
      type: String,
      required: [true, 'Por favor, añade una descripción para el servicio'],
    },
    price: {
      type: Number,
      required: [true, 'Por favor, añade un precio base para el servicio'],
    },
    category: {
      type: String,
      required: [true, 'Por favor, especifica una categoría para el servicio'],
      enum: ['Impresión 3D', 'CNC', 'Taller', 'Otro'],
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    // Campos adicionales para solicitudes de servicio podrían ir aquí o en un modelo separado
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
