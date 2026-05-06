# PíoBite - Cafetería Instituto Pío Baroja

Aplicación de pedidos anticipados para la cafetería del Instituto Pío Baroja.  
Pide tu comida desde el móvil y recógela sin colas.

---

## Qué es PíoBite

PíoBite es una plataforma digital de pre-pedidos para la cafetería del instituto.  
Inspirada en apps de comida rápida como McDonald's, permite a los alumnos y al personal:

- Ver el catálogo de productos con precios
- Hacer pedidos con antelación
- Elegir la franja horaria de recogida
- Recibir un código QR para recoger el pedido

---

## Pantallas de la app

| Pantalla | Descripción |
|----------|-------------|
| Bienvenida | Página inicial con acceso a login y registro |
| Login | Inicio de sesión con rol (Cliente / Admin) |
| Registro | Crear cuenta como alumno o personal de cafetería |
| Catálogo | Productos organizados por categorías con búsqueda |
| Carrito | Productos añadidos con control de cantidades |
| Horario | Selección de franja horaria de recogida |
| Confirmación | Código QR del pedido y resumen |
| Historial | Lista de pedidos anteriores con estado |
| Favoritos | Productos marcados como favoritos |
| Perfil | Datos del usuario, cambio de idioma ES/EN |
| Panel Admin | Gestión de pedidos para el personal de cafetería |

---

## Roles de usuario

- **Alumno / Cliente**: Explora productos, hace pedidos y gestiona favoritos
- **Personal Cafetería (Admin)**: Gestiona pedidos, verifica códigos y actualiza estados

---

## Tecnologías

- **Frontend**: React + Tailwind CSS
- **Backend**: Python (FastAPI)
- **Base de datos**: MongoDB
- **QR Code**: react-qr-code

---

## Estructura del proyecto

```
/app
├── backend/          → API del servidor (FastAPI)
│   ├── server.py     → Servidor principal con endpoints y datos
│   └── .env          → Variables de entorno
├── frontend/         → Aplicación React
│   ├── src/
│   │   ├── App.js                → Rutas y layout principal
│   │   ├── context/              → Estado global (usuario, carrito, idioma)
│   │   ├── data/                 → Traducciones ES/EN
│   │   └── components/
│   │       ├── screens/          → Pantallas de la app
│   │       └── layout/           → Navegación (BottomNav, Sidebar)
│   └── .env          → URL del backend
└── memory/
    └── PRD.md        → Documento de requisitos del proyecto
```

---

## Autores

Proyecto del Instituto Pío Baroja.

---

## Estado

**Fase 1 - Prototipo** completado.  
Navegación completa, diseño responsivo (móvil + tablet + escritorio), idiomas ES/EN.
