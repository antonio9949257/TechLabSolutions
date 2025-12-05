const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerDocs } = require('./swagger');
const { ensureBucketExists } = require('./config/minio');

dotenv.config();
connectDB();
ensureBucketExists(process.env.MINIO_BUCKET_NAME);


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => res.send('API de TechLab Solutions funcionando'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/plc', require('./routes/plcRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
