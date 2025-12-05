# TechLab Solutions - Arquitectura del Proyecto

Este repositorio contiene el proyecto de PLC ESP32 de TechLab Solutions en una arquitectura monolítica. El objetivo es proporcionar una plataforma educativa completa que abarca desde el hardware del PLC hasta una interfaz web interactiva.

## 🚀 Componentes Principales

El proyecto se divide en los siguientes componentes principales:

- **`backend/`**: Una API RESTful construida con **Node.js** y **Express**. Se encarga de toda la lógica de negocio, gestión de usuarios, procesamiento de pedidos y comunicación con la base de datos **MongoDB**. También se integra con un servicio de almacenamiento de objetos **MinIO** para los archivos. La documentación de la API se genera con **Swagger**.

- **`frontend/`**: Una Single Page Application (SPA) desarrollada con **React.js**. Proporciona la interfaz de usuario para la interacción con la plataforma, incluyendo dashboards para el control de PLCs, catálogos de productos y gestión de perfiles de usuario.

- **`firmware/`**: El código que se ejecuta en los microcontroladores **ESP32**. Este firmware es responsable de la lógica de control en tiempo real, la lectura de sensores y la comunicación con el backend.

- **`hardware/`**: Contiene los recursos de diseño de hardware, como esquemas de circuitos, diseños de PCB y listas de materiales para los kits de PLC.

- **`docs/`**: Documentación general del proyecto, tutoriales y manuales de usuario.

## Diagrama de Arquitectura

[Aquí se podría incluir un diagrama de la arquitectura general del sistema, mostrando cómo interactúan el frontend, el backend, el ESP32 y la base de datos.]

## Flujo de Datos

1.  El **ESP32** recopila datos de los sensores y los envía al **backend** a través de peticiones HTTP o WebSockets.
2.  El **backend** procesa y almacena estos datos en **MongoDB**.
3.  El **frontend** solicita los datos al **backend** para mostrarlos en el dashboard del usuario.
4.  Las acciones del usuario en el **frontend** (como activar un relé) se envían al **backend**, que a su vez las retransmite al **ESP32** correspondiente.

Para más detalles técnicos sobre cada componente, por favor consulta los `README.md` específicos en sus respectivos directorios.