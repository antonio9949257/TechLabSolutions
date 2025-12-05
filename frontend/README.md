# Frontend - TechLab Solutions

Este repositorio contiene el código fuente de la aplicación de frontend para el proyecto **TechLab Solutions**. La aplicación ha sido inicializada y estructurada para servir como la interfaz de usuario principal de la plataforma.

## Objetivo

Proporcionar una interfaz de usuario (UI) clara, intuitiva y responsiva que permita a los usuarios explorar productos y servicios, gestionar su cuenta y realizar pedidos. La aplicación está diseñada para comunicarse con un backend a través de una API REST.

---

## Pila Tecnológica

La aplicación está construida con las siguientes tecnologías:

- **React.js:** Biblioteca principal para la construcción de la interfaz de usuario.
- **React Router (`react-router-dom`):** Para la gestión de rutas y navegación dentro de la aplicación.
- **Bootstrap:** Framework de CSS para un diseño responsivo y componentes de UI estilizados.
- **Create React App:** Para la configuración inicial del proyecto y la gestión de scripts (`react-scripts`).

---

## Estructura del Proyecto

Se ha establecido una estructura de directorios para organizar el código de manera escalable:

```
src/
├── assets/         # Archivos estáticos como CSS globales, fuentes o imágenes.
├── components/     # Componentes de React reutilizables (Navbar, Footer, etc.).
├── pages/          # Componentes que representan páginas completas (Home, Login, Products, etc.).
└── services/       # Lógica para la comunicación con la API del backend (próximo a implementar).
```

---

## Comandos Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

### `npm install`
Instala todas las dependencias del proyecto listadas en `package.json`.

### `npm start`
Ejecuta la aplicación en modo de desarrollo. Abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador. La página se recargará automáticamente al realizar cambios.

### `npm run build`
Construye la aplicación para producción en la carpeta `build`. Empaqueta React de forma optimizada y prepara los archivos para el despliegue.

### `npm test`
Ejecuta el corredor de pruebas en modo interactivo.

---

## Endpoints del Backend

La aplicación está diseñada para interactuar con los siguientes endpoints del servidor:

| Funcionalidad | Backend | Frontend | Comunicación |
| :--- | :--- | :--- | :--- |
| **Autenticación** | `POST /api/auth/login` <br> `POST /api/auth/register` | Formularios de Login/Registro | JWT + REST API |
| **Productos** | `GET /api/products` | Catálogo de productos | REST API |
| **Servicios** | `GET /api/services` <br> `POST /api/services/request` | Sección de servicios y formularios | REST API |
| **Pedidos** | `POST /api/orders` <br> `GET /api/orders/user/:userId` | Carrito, Checkout e Historial | REST API |
| **Subida de Archivos** | `POST /api/upload/request-url` | Componente de subida de archivos | REST API + Pre-signed URLs |

---

## Próximos Pasos

1.  **Implementar Servicios API:** Desarrollar las funciones en `src/services` para realizar las llamadas a los endpoints del backend.
2.  **Gestión de Estado:** Integrar un manejador de estado (como Context API o Redux) para gestionar la información del usuario y el carrito de compras.
3.  **Desarrollar UI de Páginas:** Construir la interfaz de usuario para el catálogo de productos, la lista de servicios y el panel de usuario.
4.  **Conectar Componentes:** Vincular los componentes de la interfaz con la lógica de los servicios y el estado de la aplicación.
