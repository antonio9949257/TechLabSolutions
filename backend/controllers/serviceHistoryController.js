const ServiceHistory = require('../models/ServiceHistory');
const User = require('../models/User');
const { minioClient } = require('../config/minio');
const path = require('path');

// Helper function to calculate stars
const calculateServiceHistoryStars = (serviceHistory) => {
  const score = (serviceHistory.likes.length * 5) + serviceHistory.views;
  // Using log1p (ln(1+x)) to have a smoother curve for star calculation
  const stars = Math.min(5, Math.floor(Math.log1p(score)));
  return stars;
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createServiceHistory = async (req, res) => {
  const { title, description } = req.body;

  try {
    const { v4: uuidv4 } = await import('uuid');
    let imageUrl = '';

    // Handle project image upload
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const metaData = { 'Content-Type': req.file.mimetype };
      const filename = `service-history-${uuidv4()}${fileExtension}`;
      const bucketName = process.env.MINIO_BUCKET_NAME;

      await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);

      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const minioHost = process.env.MINIO_ENDPOINT;
      const minioPort = process.env.MINIO_PORT;
      imageUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
    }

    const serviceHistory = new ServiceHistory({
      title,
      description,
      image: imageUrl,
      user: req.user._id,
    });

    const createdServiceHistory = await serviceHistory.save();
    res.status(201).json(createdServiceHistory);
  } catch (error) {
    console.error('Error creating service history:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllServiceHistory = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.find({}).sort({ createdAt: -1 }).populate('user', 'name profilePicture');
    res.json(serviceHistory);
  } catch (error) {
    console.error('Error getting service history:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getServiceHistoryById = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('comments.user', 'name');

    if (serviceHistory) {
      res.json(serviceHistory);
    } else {
      res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }
  } catch (error) {
    console.error('Error getting service history by ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateServiceHistory = async (req, res) => {
  const { title, description } = req.body;

  try {
    const { v4: uuidv4 } = await import('uuid');
    const serviceHistory = await ServiceHistory.findById(req.params.id);

    if (serviceHistory) {
      serviceHistory.title = title || serviceHistory.title;
      serviceHistory.description = description || serviceHistory.description;

      // Handle service history image upload
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const metaData = { 'Content-Type': req.file.mimetype };
        const filename = `service-history-${uuidv4()}${fileExtension}`;
        const bucketName = process.env.MINIO_BUCKET_NAME;

        await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);

        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const minioHost = process.env.MINIO_ENDPOINT;
        const minioPort = process.env.MINIO_PORT;
        serviceHistory.image = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
      }

      const updatedServiceHistory = await serviceHistory.save();
      res.json(updatedServiceHistory);
    } else {
      res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }
  } catch (error) {
    console.error('Error updating service history:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteServiceHistory = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.findById(req.params.id);

    if (serviceHistory) {
      await ServiceHistory.deleteOne({ _id: req.params.id });
      res.json({ message: 'Historial de servicio eliminado' });
    } else {
      res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }
  } catch (error) {
    console.error('Error deleting service history:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Like or unlike a service history
// @route   PUT /api/service-history/:id/like
// @access  Private
const likeServiceHistory = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.findById(req.params.id);

    if (!serviceHistory) {
      return res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }

    // Check if the user has already liked the service history
    const alreadyLiked = serviceHistory.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike the service history
      serviceHistory.likes = serviceHistory.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like the service history
      serviceHistory.likes.push(req.user._id);
    }

    // Recalculate stars
    serviceHistory.stars = calculateServiceHistoryStars(serviceHistory);

    await serviceHistory.save();
    res.json(serviceHistory);
  } catch (error) {
    console.error('Error liking service history:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Increment service history view count
// @route   POST /api/service-history/:id/view
// @access  Public
const incrementViewServiceHistory = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.findById(req.params.id);

    if (!serviceHistory) {
      return res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }

    serviceHistory.views += 1;
    
    // Recalculate stars
    serviceHistory.stars = calculateServiceHistoryStars(serviceHistory);

    await serviceHistory.save();
    res.json({ message: 'Vista incrementada', views: serviceHistory.views, stars: serviceHistory.stars });
  } catch (error) {
    console.error('Error incrementing service history view count:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Add a comment to a service history
// @route   POST /api/service-history/:id/comment
// @access  Private
const addCommentServiceHistory = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'El texto del comentario es requerido' });
  }

  try {
    const serviceHistory = await ServiceHistory.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!serviceHistory) {
      return res.status(404).json({ message: 'Historial de servicio no encontrado' });
    }

    const comment = {
      user: req.user._id,
      name: user.name, // Store the user's current name
      text,
    };

    serviceHistory.comments.push(comment);

    await serviceHistory.save();
    
    // Return the newly added comment, or the whole service history
    res.status(201).json(serviceHistory);
  } catch (error) {
    console.error('Error adding service history comment:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createServiceHistory,
  getAllServiceHistory,
  getServiceHistoryById,
  updateServiceHistory,
  deleteServiceHistory,
  likeServiceHistory,
  addCommentServiceHistory,
  incrementViewServiceHistory,
};
