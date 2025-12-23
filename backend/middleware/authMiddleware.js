const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('AuthMiddleware: User not found for decoded ID:', decoded.id);
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next();
    } catch (error) {
      console.error('AuthMiddleware: Token verification failed:', error.message); // Log verification error
      res.status(401).json({ message: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    console.error('AuthMiddleware: No token provided'); // Log missing token
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'No autorizado como administrador' });
  }
};


module.exports = { protect, admin };
