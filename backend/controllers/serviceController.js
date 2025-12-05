const { validationResult } = require('express-validator');
const Service = require('../models/Service');

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const services = await Service.find(filter);
  res.json(services);
};

// @desc    Obtener un servicio por ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: 'Servicio no encontrado' });
  }
};

// @desc    Crear un servicio
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category, availability } = req.body;

  const service = new Service({
    name,
    description,
    price,
    category,
    availability,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
};

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category, availability } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price ?? service.price;
    service.category = category || service.category;
    service.availability = availability ?? service.availability;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404).json({ message: 'Servicio no encontrado' });
  }
};

// @desc    Eliminar un servicio
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    await service.deleteOne();
    res.json({ message: 'Servicio eliminado' });
  } else {
    res.status(404).json({ message: 'Servicio no encontrado' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
