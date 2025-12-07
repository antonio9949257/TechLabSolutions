const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    match: [/.+\@.+\..+/, 'Por favor, ingrese un correo electrónico válido'],
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
  },
  status: {
    type: String,
    enum: ['Nuevo', 'Contactado', 'Cerrado'],
    default: 'Nuevo',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quote', QuoteSchema);
