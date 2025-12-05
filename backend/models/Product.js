const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, añade un nombre de producto'],
    },
    description: {
      type: String,
      required: [true, 'Por favor, añade una descripción'],
    },
    price: {
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
    category: {
      type: String,
      required: [true, 'Por favor, añade una categoría'],
    },
    components: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: false, // No es obligatorio tener una imagen
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
