const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport'); // Add passport
const session = require('express-session'); // Add express-session
const connectDB = require('./config/db');
const { swaggerUi, swaggerDocs } = require('./swagger');
const { ensureBucketExists } = require('./config/minio');

dotenv.config();
connectDB();
ensureBucketExists(process.env.MINIO_BUCKET_NAME);

const app = express();
app.set('trust proxy', 1); //  ESTA LÍNEA ES CRÍTICA

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://192.168.50.57:3000'],
  credentials: true // Add this line
}));
app.use(express.json()); // Middleware to parse JSON bodies

// Session middleware for Passport
app.use(session({
  name: 'sid', // Add this line
  secret: process.env.SESSION_SECRET || 'supersecretkey', // Use a strong secret from env
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false // Set to false for local development, true for production with HTTPS
  } 
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import OIDC configuration
require('./config/googleStrategy');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => res.send('API de TechLab Solutions funcionando'));
app.get('/api', (req, res) => res.send('API base path is working'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/plc', require('./routes/plcRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en el puerto ${PORT} en 0.0.0.0`));
