const User = require('../models/User');
const { minioClient } = require('../config/minio');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const path = require('path'); // Import path module

// @desc    Obtener el perfil del usuario actual
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  // req.user es establecido por el middleware 'protect'
  res.json(req.user);
};

// @desc    Actualizar el perfil del usuario actual
// @route   PUT /api/profile
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const { v4: uuidv4 } = await import('uuid');
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { name, email, password, nickname } = req.body;

    // Manual Validation
    if (name && name.trim() === '') {
      return res.status(400).json({ message: 'El nombre no puede estar vacío.' });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'El email debe ser válido.' });
    }
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Este email ya está registrado.' });
      }
    }
    if (nickname && nickname.trim() === '') {
      return res.status(400).json({ message: 'El nickname no puede estar vacío.' });
    }
    if (nickname && nickname !== user.nickname) {
      const nicknameExists = await User.findOne({ nickname });
      if (nicknameExists) {
        return res.status(400).json({ message: 'Este nickname ya está en uso.' });
      }
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.nickname = nickname || user.nickname;

    // Handle password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle profile picture upload
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const metaData = {
        'Content-Type': req.file.mimetype,
      };
      const filename = `profile-${user._id}-${uuidv4()}${fileExtension}`;
      const bucketName = process.env.MINIO_BUCKET_NAME;

      await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);

      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const minioHost = process.env.MINIO_ENDPOINT;
      const minioPort = process.env.MINIO_PORT;
      user.profilePicture = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        nickname: updatedUser.nickname,
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
