const { validationResult } = require('express-validator');
const User = require('../models/User');
const { minioClient } = require('../config/minio');
const crypto = require('crypto');

// @desc    Obtener el perfil del usuario actual
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  // req.user es establecido por el middleware 'protect'
  res.json(req.user);
};

// @desc    Actualizar el perfil del usuario actual
// @route   PUT /api/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos de texto
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Manejar subida de nueva foto de perfil
    if (req.file) {
      const bucketName = process.env.MINIO_BUCKET_NAME;
      const fileBuffer = req.file.buffer;
      const fileName = `profile-${user._id}-${crypto.randomUUID()}`;
      
      await minioClient.putObject(bucketName, fileName, fileBuffer);
      
      user.profilePicture = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
