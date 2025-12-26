// backend/middleware/clientMiddleware.js
const isCliente = (req, res, next) => {
  if (req.user && (req.user.role === 'cliente' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado. Solo clientes o administradores.' });
  }
};

module.exports = { isCliente };
