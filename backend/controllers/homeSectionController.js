const HomeSection = require('../models/HomeSection');
const { minioClient } = require('../config/minio'); // Import minioClient for image deletion

// @desc    Get all enabled home sections for client
// @route   GET /api/home-sections
// @access  Public
const getHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find({ enabled: true }).sort({ order: 'asc' });
    res.json(sections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all home sections for admin
// @route   GET /api/admin/home-sections
// @access  Private/Admin
const getAdminHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find().sort({ order: 'asc' });
    res.json(sections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update home sections order
// @route   PUT /api/admin/home-sections/order
// @access  Private/Admin
const updateHomeSectionsOrder = async (req, res) => {
  const { sections } = req.body; // Expect an array of sections with updated order

  try {
    for (const sectionData of sections) {
      const { _id, order } = sectionData;
      await HomeSection.findByIdAndUpdate(_id, { order });
    }
    
    const updatedSections = await HomeSection.find().sort({ order: 'asc' });
    res.json(updatedSections);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a single home section
// @route   PUT /api/admin/home-sections/:id
// @access  Private/Admin
const updateHomeSection = async (req, res) => {
  const { id } = req.params;
  let { title, subtitle, content, enabled, backgroundImage } = req.body;

  try {
    // Parse content if it's a string (from FormData)
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }

    const section = await HomeSection.findById(id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Handle new image upload
    if (req.fileUrl) {
      // If there was an old image from Minio, delete it
      if (section.backgroundImage && section.backgroundImage.includes(process.env.MINIO_ENDPOINT)) {
        const oldFileName = section.backgroundImage.split('/').pop();
        try {
          await minioClient.removeObject(process.env.MINIO_BUCKET_NAME, oldFileName);
          console.log(`Old image ${oldFileName} deleted from Minio.`);
        } catch (minioErr) {
          console.error('Error deleting old image from Minio:', minioErr);
        }
      }
      backgroundImage = req.fileUrl;
    } else if (backgroundImage === '') {
      // If backgroundImage is explicitly set to empty string, delete old image if it was from Minio
      if (section.backgroundImage && section.backgroundImage.includes(process.env.MINIO_ENDPOINT)) {
        const oldFileName = section.backgroundImage.split('/').pop();
        try {
          await minioClient.removeObject(process.env.MINIO_BUCKET_NAME, oldFileName);
          console.log(`Old image ${oldFileName} deleted from Minio.`);
        } catch (minioErr) {
          console.error('Error deleting old image from Minio:', minioErr);
        }
      }
      backgroundImage = ''; // Clear the background image
    }


    const updatedSection = await HomeSection.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        content,
        enabled,
        backgroundImage,
      },
      { new: true }
    );

    res.json(updatedSection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Seed initial data for home sections
// @route   POST /api/admin/home-sections/seed
// @access  Private/Admin
const seedHomeSections = async (req, res) => {
  try {
    await HomeSection.deleteMany({});

    const sectionsToCreate = [
      {
        name: 'products',
        title: 'Nuestros Productos Destacados',
        backgroundImage: 'https://images.unsplash.com/photo-1588099612722-95143a935494?q=80&w=2070&auto=format&fit=crop',
        order: 1,
        enabled: true,
        content: [
          {
            icon: 'fas fa-camera-retro',
            title: 'Cámaras de Interior',
            description: 'Discretas y potentes, perfectas para vigilar el interior de tu hogar o negocio.',
            price: 'Desde Bs 199.99',
            link: '/products',
          },
          {
            icon: 'fas fa-video',
            title: 'Cámaras de Exterior',
            description: 'Resistentes a la intemperie y con visión nocturna para una protección 24/7.',
            price: 'Desde Bs 349.99',
            link: '/products',
          },
          {
            icon: 'fas fa-dot-circle',
            title: 'Cámaras PTZ',
            description: 'Controla el movimiento y el zoom de tus cámaras de forma remota.',
            price: 'Desde Bs 599.99',
            link: '/products',
          },
        ],
      },
      {
        name: 'kits',
        title: 'Kits Completos para tu Seguridad',
        backgroundImage: 'https://images.unsplash.com/photo-1558371539-2c5569427591?q=80&w=2070&auto=format&fit=crop',
        order: 2,
        enabled: true,
        content: [
            {
                icon: 'fas fa-box-open',
                title: 'Kit Básico Hogar',
                description: '2 cámaras de interior, 1 DVR de 4 canales y accesorios. Ideal para apartamentos y casas pequeñas.',
                price: 'Bs 899.99',
                link: '/products',
            },
            {
                icon: 'fas fa-archive',
                title: 'Kit Avanzado Negocio',
                description: '4 cámaras (2 int, 2 ext), 1 NVR de 8 canales, y disco duro de 1TB. Perfecto para oficinas.',
                price: 'Bs 2499.99',
                link: '/products',
            },
            {
                icon: 'fas fa-building',
                title: 'Kit Premium Industrial',
                description: '8 cámaras de alta definición para exterior, 1 NVR de 16 canales con analítica de video y 4TB.',
                price: 'Bs 5999.99',
                link: '/products',
            },
        ],
      },
      {
        name: 'services',
        title: 'Nuestros Servicios',
        backgroundImage: 'https://images.unsplash.com/photo-1604480133435-30b604c43c2b?q=80&w=2070&auto=format&fit=crop',
        order: 3,
        enabled: true,
        content: [
            {
                icon: 'fas fa-tools',
                title: 'Instalación Profesional',
                description: 'Instalación y configuración experta de tu sistema de seguridad.',
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Mantenimiento y Soporte',
                description: 'Planes de mantenimiento para asegurar el óptimo funcionamiento de tus equipos.',
            },
            {
                icon: 'fas fa-users-cog',
                title: 'Asesoramiento Personalizado',
                description: 'Te ayudamos a elegir la solución de seguridad que mejor se adapte a ti.',
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Monitoreo Remoto',
                description: 'Accede a tus cámaras desde cualquier lugar del mundo, en cualquier momento.',
            },
        ],
      },
    ];

    await HomeSection.insertMany(sectionsToCreate);

    res.status(201).json({ msg: 'Home sections seeded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  getHomeSections,
  getAdminHomeSections,
  updateHomeSectionsOrder,
  updateHomeSection,
  seedHomeSections,
};
