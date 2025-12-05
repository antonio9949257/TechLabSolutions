const multer = require('multer');

// Configurar multer para almacenar el archivo en memoria, listo para ser enviado a MinIO
const storage = multer.memoryStorage();

// Filtro para aceptar solo ciertos tipos de archivos de imagen
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen. Solo se permiten tipos de archivo de imagen.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limitar el tamaño del archivo a 5MB
  },
});

module.exports = upload;
