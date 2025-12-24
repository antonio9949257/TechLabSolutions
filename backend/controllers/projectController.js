const Project = require('../models/Project');
const User = require('../models/User');
const { minioClient } = require('../config/minio');
const path = require('path');

// Helper function to calculate stars
const calculateStars = (project) => {
  const score = (project.likes.length * 5) + project.views;
  // Using log1p (ln(1+x)) to have a smoother curve for star calculation
  const stars = Math.min(5, Math.floor(Math.log1p(score)));
  return stars;
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { title, description } = req.body;

  try {
    const { v4: uuidv4 } = await import('uuid');
    let imageUrl = '';

    // Handle project image upload
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const metaData = { 'Content-Type': req.file.mimetype };
      const filename = `project-${uuidv4()}${fileExtension}`;
      const bucketName = process.env.MINIO_BUCKET_NAME;

      await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);

      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const minioHost = process.env.MINIO_ENDPOINT;
      const minioPort = process.env.MINIO_PORT;
      imageUrl = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
    }

    const project = new Project({
      title,
      description,
      image: imageUrl,
      user: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 }).populate('user', 'name profilePicture');
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('comments.user', 'name');

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error getting project by ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const { title, description } = req.body;

  try {
    const { v4: uuidv4 } = await import('uuid');
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;

      // Handle project image upload
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const metaData = { 'Content-Type': req.file.mimetype };
        const filename = `project-${uuidv4()}${fileExtension}`;
        const bucketName = process.env.MINIO_BUCKET_NAME;

        await minioClient.putObject(bucketName, filename, req.file.buffer, req.file.size, metaData);

        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const minioHost = process.env.MINIO_ENDPOINT;
        const minioPort = process.env.MINIO_PORT;
        project.image = `${protocol}://${minioHost}:${minioPort}/${bucketName}/${filename}`;
      }

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await Project.deleteOne({ _id: req.params.id });
      res.json({ message: 'Proyecto eliminado' });
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Like or unlike a project
// @route   PUT /api/projects/:id/like
// @access  Private
const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Check if the user has already liked the project
    const alreadyLiked = project.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike the project
      project.likes = project.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like the project
      project.likes.push(req.user._id);
    }

    // Recalculate stars
    project.stars = calculateStars(project);

    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error liking project:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Increment project view count
// @route   POST /api/projects/:id/view
// @access  Public
const incrementView = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    project.views += 1;
    
    // Recalculate stars
    project.stars = calculateStars(project);

    await project.save();
    res.json({ message: 'Vista incrementada', views: project.views, stars: project.stars });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Add a comment to a project
// @route   POST /api/projects/:id/comment
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'El texto del comentario es requerido' });
  }

  try {
    const project = await Project.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const comment = {
      user: req.user._id,
      name: user.name, // Store the user's current name
      text,
    };

    project.comments.push(comment);

    await project.save();
    
    // Return the newly added comment, or the whole project
    res.status(201).json(project);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  likeProject,
  addComment,
  incrementView,
};
