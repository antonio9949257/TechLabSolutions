# TechLab Solutions - MVP Monolítico

Este repositorio contiene el proyecto de PLC ESP32 de TechLab Solutions en una arquitectura monolítica, donde frontend, backend, firmware y documentación conviven en un mismo lugar.

## 🚀 Estructura del Repositorio

```
techlab-solutions/
├── backend/               # Node.js + Express
├── frontend/              # React.js
├── firmware/              # Código del ESP32 (Arduino/MicroPython)
├── hardware/              # Diagramas, fotos, listas de componentes
├── docs/                  # Tutoriales, manuales y documentación
└── README.md
```

---

## 1️⃣ Backend (Node.js + Express)

**Objetivo:** Servir como intermediario entre el ESP32 (PLC) y la aplicación web, manejando datos, usuarios, ventas y control remoto.

#### Requerimientos:
- **API:** REST o WebSocket para comunicación con el ESP32.
- **Gestión de usuarios:** Registro, login y autenticación con roles (JWT).
- **Gestión de kits y ventas:** CRUD para productos e integración con pasarelas de pago.
- **Registro de datos:** Guardar lecturas del PLC para consultas históricas.
- **Base de datos:** MongoDB o Firebase.
- **Documentación:** API documentada con Swagger.

---

## 2️⃣ Frontend (React.js)

**Objetivo:** Proporcionar la interfaz de usuario para controlar los PLCs, ver lecturas, comprar kits y acceder a tutoriales.

#### Requerimientos:
- **Dashboard de PLC:** Visualización y control en tiempo real.
- **Sección de productos:** Catálogo visual con funcionalidad de compra.
- **Sección de cursos:** Acceso a material educativo con control de acceso.
- **Autenticación:** Formularios de login/registro integrados con el backend.
- **Diseño:** Responsive, claro e intuitivo.

---

## 3️⃣ Firmware (ESP32)

**Objetivo:** Ejecutar la lógica de control en el hardware del PLC, leer sensores y activar salidas.

---

## 💡 Extra Tip

Puedes usar branches separados dentro del repo para desarrollo de frontend, backend y firmware, simulando la independencia de repositorios separados mientras mantienes todo en un solo lugar para la fase inicial.
