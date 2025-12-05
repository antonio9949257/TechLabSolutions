# Backend API - TechLab Solutions

Este es el backend para la plataforma de TechLab Solutions, un emprendimiento educativo que ofrece kits y servicios de tecnología. La API está construida con Node.js, Express y MongoDB, y está diseñada para gestionar usuarios, productos, servicios, pedidos e imágenes de forma eficiente y segura.

## ✨ Características Principales

- **Gestión de Usuarios y Autenticación:**
  - Registro y login de usuarios.
  - Sistema de roles (`cliente`, `escuela`, `admin`) para control de acceso.
  - Autenticación segura mediante JSON Web Tokens (JWT).
- **Gestión de Productos:**
  - CRUD completo para productos y kits educativos.
  - Filtrado de productos por categoría.
  - Subida de imágenes de productos a un almacenamiento de objetos.
- **Gestión de Servicios:**
  - CRUD completo para servicios (impresión 3D, CNC, talleres).
- **Gestión de Pedidos:**
  - Creación y consulta de pedidos que pueden incluir productos y servicios.
  - Seguimiento de pedidos por estado (`pendiente`, `en proceso`, `completado`).
- **Gestión de Perfiles:**
  - Los usuarios pueden consultar y actualizar su propia información de perfil.
  - Soporte para subir y cambiar la foto de perfil.
- **Almacenamiento de Objetos con MinIO:**
  - Integración con MinIO para almacenar todas las imágenes (productos y perfiles), manteniendo la base de datos ligera.
- **Documentación de API con Swagger:**
  - Documentación interactiva y completa de todos los endpoints disponible en `/api-docs`.

## 🚀 Pila Tecnológica

- **Node.js & Express:** Para la construcción de la API REST.
- **MongoDB & Mongoose:** Como base de datos NoSQL y ODM.
- **JSON Web Token (JWT) & bcryptjs:** Para autenticación y hashing de contraseñas.
- **MinIO & Multer:** Para el almacenamiento de objetos y manejo de subida de archivos.
- **Swagger (swagger-jsdoc & swagger-ui-express):** Para la documentación de la API.
- **dotenv:** Para la gestión de variables de entorno.

## 🛠️ Setup y Uso

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v20.x o superior)
- `npm`
- Una instancia de [MongoDB](https://www.mongodb.com/try/download/community) (local o en la nube como Atlas).
- Una instancia de [MinIO](https://min.io/docs/minio/container/index.html) (se recomienda usar Docker).

### 1. Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd backend
npm install
```

### 2. Configuración del Entorno

Crea un archivo `.env` en la raíz del directorio `backend` y añade las siguientes variables. Reemplaza los valores de ejemplo con tu configuración local.

```env
# Puerto para el servidor
PORT=5001

# URI de conexión de MongoDB
# Ejemplo para MongoDB Atlas: mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
# Ejemplo para MongoDB local: mongodb://localhost:27017/techlab
MONGO_URI=mongodb://localhost:27017/techlab

# Secreto para firmar los JSON Web Tokens (JWT)
JWT_SECRET=micadenasecreta123

# --- Configuración de MinIO ---
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=techlab
```

### 3. Ejecutar el Servidor

Una vez configurado el entorno, puedes iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:5001` (o el puerto que hayas definido).

## 📚 API Endpoints

La API está estructurada en torno a los siguientes recursos principales:

- `POST /api/users/register`: Registro de nuevos usuarios.
- `POST /api/users/login`: Autenticación de usuarios.
- `GET, POST /api/products`: Obtener y crear productos.
- `PUT, DELETE /api/products/:id`: Actualizar y eliminar un producto.
- `GET, POST /api/services`: Obtener y crear servicios.
- `GET, PUT, DELETE /api/services/:id`: Obtener, actualizar y eliminar un servicio.
- `POST /api/orders`: Crear una nueva orden.
- `GET /api/orders/myorders`: Obtener las órdenes del usuario actual.
- `GET /api/profile/me`: Obtener el perfil del usuario actual.
- `PUT /api/profile/me`: Actualizar el perfil del usuario actual (incluyendo foto).

Para una guía completa e interactiva de todos los endpoints, modelos y ejemplos, visita la **documentación de Swagger** una vez que el servidor esté corriendo:

➡️ [**http://localhost:5001/api-docs**](http://localhost:5001/api-docs)