const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'TechLab Solutions API',
      version: '1.0.0',
      description: 'Documentación de la API para el backend de TechLab Solutions',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string', enum: ['cliente', 'escuela', 'admin'] },
                profilePicture: { type: 'string' },
            }
        },
        Product: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            precio: { type: 'number' },
            sku: { type: 'string' },
            stock: { type: 'number' },
            categoria: { type: 'string' },
            especificaciones: { type: 'object' },
            img_url: { type: 'string' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string', enum: ['Impresión 3D', 'CNC', 'Taller', 'Otro'] },
            availability: { type: 'boolean' },
          },
        },
        Order: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                user: { type: 'string' },
                orderItems: { 
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            qty: { type: 'number' },
                            price: { type: 'number' },
                            product: { type: 'string' },
                            service: { type: 'string' },
                        }
                    }
                },
                totalPrice: { type: 'number' },
                status: { type: 'string' },
                isPaid: { type: 'boolean' },
                paidAt: { type: 'string', format: 'date-time' },
            }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
