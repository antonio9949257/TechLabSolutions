const Minio = require('minio');
const dotenv = require('dotenv');

dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Función para asegurar que el bucket exista
const ensureBucketExists = async (bucketName) => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            console.log(`Bucket ${bucketName} creado.`);
            // Opcional: establecer política de acceso público para leer imágenes
            const policy = JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            });
            await minioClient.setBucketPolicy(bucketName, policy);
            console.log(`Política de acceso público establecida para el bucket ${bucketName}.`);
        }
    } catch (error) {
        console.error('Error al asegurar la existencia del bucket:', error);
    }
};


module.exports = { minioClient, ensureBucketExists };
