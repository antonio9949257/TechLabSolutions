const Service = require('../models/Service');
const { minioClient } = require('../config/minio'); // Import MinIO client
const path = require('path'); // Import path module

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
  try {
    const { v4: uuidv4 } = await import('uuid');
    const { name, description, price, category, availability } = req.body;

    // Manual Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Por favor, complete todos los campos obligatorios: nombre, descripción, precio, categoría.' });
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un valor numérico positivo.' });
    }

    let imageUrl = '';
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const metaData = {
        'Content-Type': req.file.mimetype,
      };
      const filename = `${uuidv4()}${fileExtension}`;
      const bucketName = process.env.MINIO_BUCKET_NAME; // Use bucket name from .env

      await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const minioHost = process.env.MINIO_ENDPOINT;
      const minioPort = process.env.MINIO_PORT;
      imageUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
    }

    const service = new Service({
      name,
      description,
      price: parseFloat(price),
      category,
      availability: availability === 'true', // Convert string to boolean
      image: imageUrl,
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear el servicio.' });
  }
};

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { v4: uuidv4 } = await import('uuid');
    const { name, description, price, category, availability } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    // Manual Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Por favor, complete todos los campos obligatorios: nombre, descripción, precio, categoría.' });
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un valor numérico positivo.' });
    }

    let imageUrl = service.image; // Keep existing image by default
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const metaData = {
        'Content-Type': req.file.mimetype,
      };
      const filename = `${uuidv4()}${fileExtension}`;
      const bucketName = process.env.MINIO_BUCKET_NAME; // Use bucket name from .env

      await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const minioHost = process.env.MINIO_ENDPOINT;
      const minioPort = process.env.MINIO_PORT;
      imageUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
    }

    service.name = name;
    service.description = description;
    service.price = parseFloat(price);
    service.category = category;
    service.availability = availability === 'true'; // Convert string to boolean
    service.image = imageUrl;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el servicio.' });
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
