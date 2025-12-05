const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: PLC
 *   description: API para interactuar con el PLC (ESP32)
 */

// No hay rutas de PLC definidas por el momento.

module.exports = router;
