const express = require('express');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Server from socket.io
const jwt = require('jsonwebtoken');
const User = require('./models/User');
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
const server = http.createServer(app); // Create http server from express app
const io = new Server(server, { // Initialize socket.io with the http server
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.50.57:3000'], // Allow frontend origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});

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
app.use('/api/users', require('./routes/authRoutes')(io));
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
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes')(io)); // Add notification routes and pass io

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message || 'Something broke!' });
});

// Socket.IO connection handling
const onlineUsers = new Map(); // Map to store online users: userId -> socketId

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  const userId = socket.user._id.toString();

  // Add user to online list and join room
  onlineUsers.set(userId, socket.id);
  socket.join(userId);
  io.emit('updateUserStatus', { userId, status: 'online' });
  console.log(`User ${userId} is online. Total online: ${onlineUsers.size}`);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    onlineUsers.delete(userId);
    io.emit('updateUserStatus', { userId, status: 'offline' });
    console.log(`User ${userId} is offline. Total online: ${onlineUsers.size}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en el puerto ${PORT} en 0.0.0.0 con WebSockets`));
