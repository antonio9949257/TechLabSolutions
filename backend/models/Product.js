const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Por favor, añade un nombre de producto'],
    },
    descripcion: {
      type: String,
      required: [true, 'Por favor, añade una descripción'],
    },
    precio: {
      type: Number,
      required: [true, 'Por favor, añade un precio'],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Por favor, añade una categoría'],
    },
    especificaciones: {
      type: Object,
      default: {},
    },
    img_url: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
