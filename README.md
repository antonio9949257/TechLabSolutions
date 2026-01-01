# TechLab Solutions - Plataforma Full-Stack

Este repositorio contiene el código fuente de TechLab Solutions, una plataforma web full-stack diseñada como una solución de e-commerce o catálogo técnico avanzado. La aplicación cuenta con un panel de administración completo, funcionalidades en tiempo real y una arquitectura moderna basada en JavaScript.

## 📋 Tabla de Contenidos
1. [Funcionalidades Principales](#-funcionalidades-principales)
2. [Arquitectura y Stack Tecnológico](#-arquitectura-y-stack-tecnológico)
3. [Conceptos Clave de la Arquitectura](#-conceptos-clave-de-la-arquitectura)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
6. [Scripts Disponibles](#-scripts-disponibles)
7. [Documentación de la API](#-documentación-de-la-api)

## ✨ Funcionalidades Principales

- **Gestión de Autenticación:** Sistema de registro y login local y con proveedores externos (Google OAuth).
- **Roles de Usuario:** Clara separación entre permisos de administrador y cliente.
- **Catálogo Completo:** Gestión de Productos, Categorías, Servicios y Kits.
- **Carrito de Compras:** Flujo completo de carrito de compras persistente por usuario.
- **Gestión de Pedidos:** Creación y seguimiento de pedidos.
- **Panel de Administración:** Dashboards para gestionar todas las entidades de la aplicación (usuarios, productos, pedidos, etc.).
- **Notificaciones en Tiempo Real:** Sistema de notificaciones push para usuarios mediante WebSockets.
- **Integración Industrial (PLC):** Capacidad única para interactuar con Controladores Lógicos Programables.
- **Almacenamiento de Objetos:** Uso de MinIO (compatible con S3) para la gestión de imágenes y backups.

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto sigue una arquitectura de monorepo, con el backend y el frontend desacoplados pero dentro del mismo repositorio.

### Backend

- **Framework:** Node.js con Express.js.
- **Base de Datos:** MongoDB con Mongoose como ODM (Object-Document Mapper).
- **Autenticación:** Basada en Tokens (JWT) y OAuth 2.0.
- **Comunicación en Tiempo Real:** WebSockets (probablemente con la librería `ws` o `socket.io`).
- **Almacenamiento de Ficheros:** MinIO.
- **Documentación de API:** Swagger.

### Frontend

- **Librería:** React.
- **Gestión de Estado:** React Context API para estados globales (Auth, Cart, Notifications, Socket).
- **Enrutamiento:** React Router.
- **Estilos:** Tailwind CSS (Utility-First).
- **Comunicación con API:** Cliente HTTP (Axios o Fetch) centralizado.

## 🚀 Conceptos Clave de la Arquitectura

#### Notificaciones en Tiempo Real
El sistema combina una API REST para la persistencia de notificaciones en la base de datos con un servidor de WebSockets. Cuando se crea una notificación, se guarda y se emite un evento en tiempo real al cliente correspondiente, permitiendo una UI dinámica sin necesidad de recargar la página.

#### Almacenamiento de Objetos con MinIO
En lugar de guardar ficheros (imágenes de productos, backups) en el sistema de archivos local del servidor, se utiliza un servicio de almacenamiento de objetos compatible con S3. Esto facilita la escalabilidad, la gestión de backups y el despliegue en entornos distribuidos.

#### Integración Industrial (PLC)
La presencia de un `plcController` indica que el sistema no es solo una plataforma web estándar, sino que tiene la capacidad de comunicarse con hardware industrial, abriendo la puerta a casos de uso en el ámbito de IoT y la automatización industrial.

## 📁 Estructura del Proyecto

```
/
├── backend/
│   ├── config/         # Conexión a BD, Passport, MinIO
│   ├── controllers/    # Lógica de negocio
│   ├── middleware/     # Middlewares de Express (auth, admin, uploads)
│   ├── models/         # Esquemas de Mongoose para la BD
│   ├── routes/         # Definición de rutas de la API
│   ├── server.js       # Punto de entrada del servidor
│   └── package.json
│
├── frontend/
│   ├── public/         # Ficheros estáticos
│   ├── src/
│   │   ├── assets/     # Imágenes, iconos
│   │   ├── components/ # Componentes reutilizables
│   │   ├── context/    # Contextos de React para estado global
│   │   ├── pages/      # Componentes de página completa
│   │   ├── services/   # Lógica de comunicación con la API
│   │   └── App.js      # Componente raíz y enrutador
│   └── package.json
│
└── README.md
```

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm
- Una instancia de MongoDB en ejecución.
- (Opcional) Una instancia de MinIO en ejecución.

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd techLabSolutions
```

### 2. Configurar Variables de Entorno

Crea un fichero `.env` dentro de la carpeta `backend` a partir del `.env.example` y configúralo:

```ini
# backend/.env
MONGO_URI=mongodb://localhost:27017/techlab
JWT_SECRET=tu_secreto_para_jwt
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

Crea un fichero `.env` dentro de la carpeta `frontend` y configúralo:

```ini
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Ejecutar la Aplicación

```bash
# Iniciar el servidor del backend (desde la carpeta /backend)
# Se ejecutará en http://localhost:5000
npm start

# En otra terminal, iniciar el cliente de React (desde la carpeta /frontend)
# Se ejecutará en http://localhost:3000
npm start
```

## 📜 Scripts Disponibles

Dentro de `frontend/` y `backend/`, puedes ejecutar los siguientes scripts:

- `npm start`: Inicia el servidor de desarrollo.
- `npm run build`: (Solo frontend) Compila la aplicación para producción.
- `npm test`: Ejecuta los tests.

## 📚 Documentación de la API

La API del backend está documentada con Swagger. Una vez que el servidor del backend esté en ejecución, puedes acceder a la documentación interactiva en la siguiente URL:

[http://localhost:5000/api-docs](http://localhost:5000/api-docs)
