const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
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
    profilePicture: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random`,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Autenticar un usuario
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      profilePicture: user.profilePicture,
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
  const { name, email, password, role } = req.body;

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
    profilePicture: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random`,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Actualizar un usuario (solo admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { name, email, role } = req.body; // Password update would be separate or handled carefully

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  if (role && !['cliente', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
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
};
