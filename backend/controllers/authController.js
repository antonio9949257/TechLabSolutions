const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Import Notification model
const { createNotification } = require('./notificationController'); // Import createNotification

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, whatsappNumber } = req.body;
  let role = req.body.role;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  // Un usuario no puede auto-asignarse como admin.
  // Solo permite 'cliente', por defecto es 'cliente'.
  if (!role || !['cliente'].includes(role)) {
    role = 'cliente';
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role, // Usar el rol sanitizado
    whatsappNumber,
    profilePicture: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random`,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Autenticar un usuario
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, io) => { // Accept io
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Emit user online status via Socket.IO
    io.emit('updateUserStatus', { userId: user._id, status: 'online' });

    // Fetch unread notifications for the user
    const unreadNotifications = await Notification.find({ recipient: user._id, read: false })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profilePicture');

    // Send unread notifications to the specific user via Socket.IO
    // This assumes the user's socket is known, which is handled in server.js
    io.to(user._id.toString()).emit('notifications', unreadNotifications); // Emit to specific user's room

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      profilePicture: user.profilePicture,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Credenciales inválidas' });
  }
};

// @desc    Obtener datos del usuario
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  // Check if the logged-in user is an admin
  // This check is also done by adminProtect middleware, but good to have here too
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No autorizado. Solo administradores.' });
  }

  const users = await User.find({}).select('-password'); // Get all users, exclude password
  res.status(200).json(users);
};

// @desc    Crear un nuevo usuario (solo admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, role, whatsappNumber } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos' });
  }

  if (!['cliente', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    whatsappNumber,
    profilePicture: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random`,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      whatsappNumber: user.whatsappNumber,
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Actualizar un usuario (solo admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { name, email, role, status, whatsappNumber } = req.body; // Add status to destructuring

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (role && !['cliente', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  if (status && !['active', 'inactive'].includes(status)) { // Validate status
    return res.status(400).json({ message: 'Estado inválido' });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.status = status || user.status; // Update status
  user.whatsappNumber = whatsappNumber || user.whatsappNumber;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status, // Include status in response
    whatsappNumber: updatedUser.whatsappNumber,
  });
};

// @desc    Eliminar un usuario (solo admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  await user.deleteOne(); // Use deleteOne() for Mongoose 6+

  res.status(200).json({ message: 'Usuario eliminado exitosamente', id: req.params.id });
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  // This check is also done by adminProtect middleware, but good to have here too
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No autorizado. Solo administradores.' });
  }

  const user = await User.findById(req.params.id).select('-password'); // Get user by ID, exclude password

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.status(200).json(user);
};

// @desc    Eliminar la cuenta del usuario autenticado
// @route   DELETE /api/users/me
// @access  Private
const deleteMe = async (req, res, io) => { // Accept io
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    // Emit user offline status via Socket.IO
    io.emit('updateUserStatus', { userId, status: 'offline' });
    res.status(200).json({ message: 'Tu cuenta ha sido eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para generar el JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  deleteMe,
  getUserById, // Add new function to exports
};
