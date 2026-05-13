# 🍔 PíoBite - Cafetería Instituto Pío Baroja

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

PíoBite es una plataforma de pre-pedidos diseñada para optimizar los tiempos de descanso en el Instituto Pío Baroja. Los usuarios pueden pedir su comida con antelación, elegir su franja horaria y recoger su pedido escaneando un código QR, eliminando las esperas en ventanilla.

---

## 🚀 Despliegue (Live Demo)

La aplicación se encuentra desplegada y operativa en los siguientes enlaces:

* **🌐 Frontend:** [ https://app-cafeteria-piobaroja-production.up.railway.app](https://powerful-rejoicing-production-982d.up.railway.app/)
* **⚙️ API Backend:** https://app-cafeteria-piobaroja-production.up.railway.app/docs

---

## ✨ Características Principales

- **Sistema Multi-rol**: Alumno/Cliente y Personal de Cafetería (Admin).
- **Catálogo Interactivo**: Búsqueda por categorías y gestión de favoritos.
- **Gestión de Pedidos**: Selección de franjas horarias y generación automática de **códigos QR**.
- **Panel de Administración**: Control de flujo de pedidos en tiempo real para el personal.
- **Multi-idioma**: Soporte completo para Español e Inglés (i18n).
- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y escritorio.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con **Tailwind CSS** para una interfaz moderna y rápida.
- **Context API** para la gestión del estado global (carrito, usuario e idioma).
- **Lucide React** para iconografía y **react-qr-code** para validaciones.

### Backend
- **Python 3.x** con **FastAPI** por su alto rendimiento y documentación automática (Swagger).
- **MongoDB** como base de datos NoSQL escalable.
- **Uvicorn** como servidor de producción ASGI.

---

## 📂 Estructura del Proyecto

```bash
├── backend/            # API Servidor (Python/FastAPI)
│   ├── server.py       # Lógica principal y conexión a DB
│   └── requirements.txt# Dependencias de Python
├── frontend/           # Interfaz de Usuario (React)
│   ├── src/
│   │   ├── context/    # Gestión de estado (Auth, Cart, Lang)
│   │   ├── components/ # Componentes reutilizables y pantallas
│   │   └── data/       # Archivos de traducción i18n
│   └── package.json    # Dependencias de Node.js
└── memory/             # Documentación técnica (PRD)
