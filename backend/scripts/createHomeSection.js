const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HomeSection = require('../models/HomeSection'); // Adjust path if necessary

dotenv.config({ path: './.env' }); // Load environment variables from backend/.env

const createTestHomeSections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const sectionsToCreate = [
      {
        name: 'hero-section',
        title: 'Bienvenido a TechLab Solutions',
        subtitle: 'Innovación y tecnología para tu negocio',
        content: {
          description: 'Ofrecemos soluciones personalizadas para impulsar tu crecimiento.',
          buttonText: 'Descubre más',
          buttonLink: '/products'
        },
        order: 1,
        enabled: true,
        backgroundImage: 'https://example.com/hero-bg.jpg' // Placeholder image
      },
      {
        name: 'products-showcase',
        title: 'Nuestros Productos Destacados',
        subtitle: 'Explora nuestra gama de soluciones tecnológicas',
        content: {
          products: [
            { title: 'Cámara IP', description: 'Cámara de seguridad con visión nocturna.', price: '$50', link: '/products/1', icon: 'fas fa-camera' },
            { title: 'Sensor de Movimiento', description: 'Detecta movimiento y envía alertas.', price: '$25', link: '/products/2', icon: 'fas fa-walking' }
          ]
        },
        order: 2,
        enabled: true,
      },
      {
        name: 'services-overview',
        title: 'Servicios Profesionales',
        subtitle: 'Soluciones a medida para tus necesidades',
        content: {
          services: [
            { title: 'Instalación de Cámaras', description: 'Instalación profesional de sistemas de videovigilancia.', icon: 'fas fa-video' },
            { title: 'Mantenimiento Preventivo', description: 'Servicio de mantenimiento para asegurar el óptimo funcionamiento.', icon: 'fas fa-tools' }
          ]
        },
        order: 3,
        enabled: true,
      },
      {
        name: 'contact-us',
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte',
        content: {
          text: 'Envíanos un mensaje o llámanos.',
          email: 'info@techlab.com'
        },
        order: 4,
        enabled: false, // Start as disabled to show toggle functionality
      }
    ];

    for (const sectionData of sectionsToCreate) {
      const existingSection = await HomeSection.findOne({ name: sectionData.name });
      if (existingSection) {
        // Update existing section
        await HomeSection.updateOne({ name: sectionData.name }, { $set: sectionData });
        console.log(`HomeSection "${sectionData.name}" updated successfully!`);
      } else {
        // Create new section
        const newSection = new HomeSection(sectionData);
        await newSection.save();
        console.log(`HomeSection "${sectionData.name}" created successfully!`);
      }
    }

  } catch (error) {
    console.error(`Error creating test HomeSections: ${error.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

createTestHomeSections();