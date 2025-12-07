const Quote = require('../models/Quote');
const Service = require('../models/Service');

// @desc    Create a new quote request
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res) => {
  try {
    const { serviceId, name, email, phone, message } = req.body;

    // Validate serviceId
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    const newQuote = new Quote({
      service: serviceId,
      name,
      email,
      phone,
      message,
    });

    await newQuote.save();

    res.status(201).json({ message: 'Solicitud de cotización enviada con éxito.' });
  } catch (error) {
    console.error('Error al crear la cotización:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// @desc    Get all quote requests
// @route   GET /api/quotes
// @access  Private/Admin
exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().populate('service', 'name');
    res.json(quotes);
  } catch (error) {
    console.error('Error al obtener las cotizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
