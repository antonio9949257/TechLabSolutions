const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, añade un nombre'],
    },
    nickname: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to not violate unique constraint
    },
    email: {
      type: String,
      required: [true, 'Por favor, añade un email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor, añade una contraseña'],
    },
    role: {
      type: String,
      required: true,
      enum: ['cliente', 'admin'],
      default: 'cliente',
    },
    profilePicture: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
