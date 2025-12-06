// backend/middleware/clientMiddleware.js
const isCliente = (req, res, next) => {
  if (req.user && req.user.role === 'cliente') {
    next();
  } else {
    res.status(403).json({ message: 'No autorizado. Solo clientes.' });
  }
};

module.exports = { isCliente };
