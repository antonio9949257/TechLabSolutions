// backend/middleware/adminMiddleware.js
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado. Solo administradores.' });
  }
};

module.exports = { adminProtect };
