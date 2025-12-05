# Frontend - TechLab Solutions

Este es el frontend para la plataforma de TechLab Solutions, construido con React. Proporciona la interfaz de usuario para que los clientes interactúen con los servicios y productos de TechLab.

## ✨ Características Principales

- **Dashboard de Usuario:** Visualización de datos de PLC en tiempo real, gestión de dispositivos.
- **Catálogo de Productos:** Navegación y compra de kits de PLC y otros productos.
- **Páginas de Servicios:** Información y solicitud de servicios como impresión 3D.
- **Autenticación de Usuarios:** Registro, inicio de sesión y gestión de perfiles de usuario.
- **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

## 🚀 Pila Tecnológica

- **React.js:** Para construir la interfaz de usuario.
- **React Router:** Para el enrutamiento del lado del cliente.
- **Axios:** Para la comunicación con la API del backend.
- **CSS Modules / Styled-components (a definir):** Para el estilo de los componentes.
- **Context API / Redux (a definir):** Para el manejo del estado global de la aplicación.

## Pages y Componentes

La aplicación está estructurada en las siguientes páginas principales:

- **/ (Home):** Página de inicio con una descripción general de TechLab Solutions.
- **/login:** Formulario de inicio de sesión.
- **/register:** Formulario de registro.
- **/dashboard:** Panel de control del usuario para ver y gestionar sus PLCs.
- **/products:** Catálogo de productos.
- **/services:** Información sobre los servicios ofrecidos.

Los componentes reutilizables como `Navbar` y `Footer` se encuentran en el directorio `src/components`.

## Conexión con el Backend

El frontend se comunica con la API del backend de TechLab Solutions para:

- Autenticar usuarios.
- Obtener y mostrar productos y servicios.
- Enviar pedidos.
- Obtener datos de los PLCs.

La URL base de la API se configura en los servicios de la aplicación (actualmente apuntando a `http://localhost:5000/api`).
