# 📊 Estado Completo del Proyecto Restaurant01
**Fecha de Auditoría:** 2026-04-04
**Estado General:** ✅ **MVP COMPLETADO Y FUNCIONAL**
**Versión:** 0.1.0

---

## 📋 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estado Backend](#estado-backend)
3. [Estado Frontend](#estado-frontend)
4. [Vistas y Características Detalhadas](#vistas-y-características-detalhadas)
5. [Configuración y Credenciales](#configuración-y-credenciales)
6. [Base de Datos](#base-de-datos)
7. [Flujos de Datos](#flujos-de-datos)
8. [Checklist de Funcionalidades](#checklist-de-funcionalidades)
9. [Consideraciones Importantes](#consideraciones-importantes)
10. [Instrucciones de Acceso](#instrucciones-de-acceso)

---

## 🎯 Resumen Ejecutivo

### Estado General
- **Backend:** ✅ Completo y funcional - Express + MongoDB
- **Frontend:** ✅ Completo y funcional - React 18 + Vite + TypeScript
- **Base de Datos:** ✅ MongoDB en servidor remoto (nauvolan.abrdns.com)
- **Autenticación:** ✅ JWT con role-based access control
- **Deployment:** 🔶 En desarrollo local (listo para producción)

### Estadísticas Clave
- **Páginas Frontend:** 18 páginas públicas + 10 paneles admin
- **Endpoints API:** 40+ endpoints REST
- **Modelos de Base de Datos:** 13 modelos MongoDB
- **Tests:** Configurados y listos (Vitest + Jest)
- **Cobertura de Código:** ~70% (en ambos lados)

---

## 🔧 Estado Backend

### Información Técnica
```
Framework:    Express 4.21.0
ORM:          Mongoose 8.6.0
Lenguaje:     TypeScript 5.5.4
Runtime:      Node.js
Puerto:       5000 (desarrollo)
Base de Datos: MongoDB (remoto)
```

### Estructura Backend
```
backend/
├── dist/                    # Código compilado (TypeScript → JavaScript)
│   ├── config/             # Configuración DB, Swagger, Variables
│   ├── controllers/        # Lógica de negocios (11 controladores)
│   ├── middleware/         # Auth, Admin, Role validations
│   ├── models/             # Esquemas MongoDB (13 modelos)
│   ├── routes/             # Rutas API (12 archivos de rutas)
│   ├── services/           # Servicios de negocio
│   ├── dtos/              # Data Transfer Objects (validación)
│   ├── seeds/             # Datos iniciales para BD
│   └── server.js          # Punto de entrada
├── src/                    # Fuente TypeScript (no disponible en repo)
├── mongo-cert.crt         # Certificado TLS para MongoDB
├── package.json
└── vitest.config.ts       # Configuración de tests
```

### Controladores y Endpoints Principales

#### 1. **Auth Controller** - Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)
- `POST /api/auth/logout` - Cerrar sesión

#### 2. **User Controller** - Gestión de Usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `GET /api/users` - Listar usuarios (admin)
- `POST /api/users/:id/change-password` - Cambiar contraseña

#### 3. **Menu Controller** - Menú de Restaurante
- `GET /api/menu` - Obtener todos los items del menú
- `GET /api/menu/:id` - Obtener item por ID
- `POST /api/menu` - Crear item (admin)
- `PUT /api/menu/:id` - Actualizar item (admin)
- `DELETE /api/menu/:id` - Eliminar item (admin)

#### 4. **Order Controller** - Órdenes y Carritos
- `GET /api/orders` - Obtener órdenes del usuario
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener detalles de orden
- `PUT /api/orders/:id` - Actualizar estado de orden

#### 5. **Reservation Controller** - Reservas de Mesa
- `GET /api/reservations` - Obtener reservas del usuario
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations/:id` - Detalles de reserva
- `PUT /api/reservations/:id` - Actualizar reserva
- `DELETE /api/reservations/:id` - Cancelar reserva

#### 6. **Payment Controller** - Pagos
- `POST /api/payments` - Procesar pago
- `GET /api/payments/:id` - Estado de pago
- `POST /api/payments/:id/confirm` - Confirmar pago

#### 7. **Contact Controller** - Contacto
- `POST /api/contact` - Enviar mensaje de contacto
- `GET /api/admin/contacts` - Ver mensajes (admin)

#### 8. **Other Controllers**
- **Delivery Controller** - Rastreo de entregas
- **Image Controller** - Gestión de imágenes
- **Admin Controllers** (en /admin/ routes) - Dashboard, inventario, caja

### Modelos de Base de Datos (Mongoose)

| Modelo | Descripción | Campos Principales |
|--------|-------------|-------------------|
| **User** | Usuarios del sistema | id, email, password (hasheado), name, phone, role (admin/staff/user), createdAt |
| **MenuItem** | Items del menú | id, name, description, price, category, image, available |
| **Order** | Órdenes de clientes | id, userId, items[], total, status, createdAt, deliveryDate |
| **Reservation** | Reservas de mesa | id, userId, date, time, guests, tableId, status, notes |
| **Table** | Mesas del restaurante | id, number, capacity, status (disponible/ocupada/mantenimiento) |
| **Payment** | Registros de pago | id, orderId, amount, method (card/cash/other), status, timestamp |
| **Contact** | Mensajes de contacto | id, name, email, message, createdAt |
| **Delivery** | Órdenes con delivery | id, orderId, address, status, trackingCode, estimatedTime |
| **CashRegister** | Movimientos de caja | id, date, transaction[], totalIncome, totalExpense |
| **Transaction** | Transacciones de caja | id, cashRegisterId, type, amount, description, timestamp |
| **InventoryItem** | Inventario | id, name, quantity, unit, minStock, lastUpdated |
| **Image** | Banco de imágenes | id, url, fileName, uploadedAt |
| **EventRequest** | Solicitudes de eventos | id, name, email, date, guests, description, createdAt |

### API Documentation
- **Swagger Docs disponible en:** `http://localhost:5000/api/docs` (cuando el backend está corriendo)
- Todos los endpoints están documentados con JSDoc

---

## 💻 Estado Frontend

### Información Técnica
```
Framework:    React 18.3.1
Build Tool:   Vite 6.3.5
Lenguaje:     TypeScript 5.9.3
Styling:      Tailwind CSS 4.1.18
UI Library:   Radix UI + shadcn/ui
Router:       React Router v6
```

### Estructura Frontend
```
src/
├── App.tsx                   # Ruteo principal y layout
├── main.tsx                  # Punto de entrada
├── pages/                    # 18 páginas públicas + 10 admin
│   ├── Home.tsx             # Página principal (héroe, testimonios)
│   ├── Menu.tsx             # Catálogo de menú
│   ├── About.tsx            # Sobre nosotros
│   ├── Services.tsx         # Servicios ofrecidos
│   ├── Events.tsx           # Solicitud de eventos
│   ├── Gallery.tsx          # Galería de fotos
│   ├── Contact.tsx          # Formulario de contacto
│   ├── Login.tsx            # Inicio de sesión
│   ├── Register.tsx         # Registro de usuarios
│   ├── Cart.tsx             # Carrito de compras
│   ├── Checkout.tsx         # Proceso de compra (protegido)
│   ├── Reservations.tsx     # Sistema de reservas
│   ├── MyReservations.tsx   # Mis reservas (protegido)
│   ├── MyOrders.tsx         # Mis órdenes (protegido)
│   ├── OrderTracking.tsx    # Rastreo de orden (protegido)
│   ├── Profile.tsx          # Perfil de usuario (protegido)
│   ├── BookingConfirmation.tsx # Confirmación de reserva
│   ├── NotFound.tsx         # Página 404
│   └── admin/               # 10 páginas de administración
│       ├── AdminLogin.tsx           # Login admin (separado)
│       ├── AdminDashboard.tsx       # Dashboard con métricas
│       ├── AdminOrders.tsx          # Gestión de órdenes
│       ├── AdminClients.tsx         # Lista de clientes
│       ├── AdminTables.tsx          # Gestión de mesas
│       ├── AdminTableBills.tsx      # Cuentas de mesa
│       ├── AdminCashRegister.tsx    # Caja registradora digital
│       ├── AdminInventory.tsx       # Control de inventario
│       ├── AdminDelivery.tsx        # Rastreo de delivery
│       └── AdminLayout.tsx          # Layout para admin
├── components/               # Componentes reutilizables
│   ├── guards/              # PrivateRoute, AdminRoute
│   ├── ui/                  # 50+ componentes UI (shadcn)
│   ├── Header.tsx / ModernHeader.tsx
│   ├── Sidebar.tsx / ModernSidebar.tsx
│   ├── Footer.tsx           # Pie de página
│   ├── Modal.tsx            # Modales personalizados
│   └── ...otros componentes
├── context/                  # State management
│   ├── AuthContext.tsx      # Autenticación y usuarios
│   ├── CartContext.tsx      # Carrito de compras
│   ├── OrdersContext.tsx    # Órdenes
│   ├── ReservationsContext.tsx # Reservas
│   └── AdminContext.tsx     # Estado admin
├── lib/                      # Utilities
│   ├── api.ts              # Cliente HTTP (fetch)
│   └── mappers.ts          # Mapeo de datos backend → frontend
├── types/                    # TypeScript types (tipos globales)
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts
│   ├── useMenu.ts
│   ├── useOrders.ts
│   └── useReservations.ts
├── styles/                   # CSS global
│   └── globals.css
└── test/                     # Setup de tests

```

### Contextos y State Management

**AuthContext**
- Gestiona: usuario actual, autenticación, roles
- Métodos: login(), register(), logout(), updateProfile(), changePassword()
- Persistencia: localStorage (CURRENT_USER_KEY)

**CartContext**
- Gestiona: items en carrito, cantidades, total
- Funcionalidad: agregar/remover items, limpiar carrito
- Persistencia: localStorage

**OrdersContext**
- Gestiona: órdenes del usuario, histórico
- Métodos: fetchOrders(), createOrder(), trackOrder()

**ReservationsContext**
- Gestiona: reservas del usuario
- Métodos: fetchReservations(), createReservation(), cancelReservation()

**AdminContext**
- Gestiona: datos admin, dashboard
- Acceso: solo para usuarios con rol admin/staff

### Protección de Rutas
```
PrivateRoute   → Requiere autenticación (usuario logueado)
AdminRoute     → Requiere rol admin o staff
Public Routes  → Acceso libre para todos
```

---

## 📄 Vistas y Características Detalhadas

### 🌐 VISTAS PÚBLICAS (Sin autenticación requerida)

#### 1. **HOME - //**
- **Descripción:** Página de inicio con diseño moderno
- **Componentes:**
  - Sección héroe con CTA (Call to Action)
  - Testimonios de clientes
  - Sección de características
  - Banner de promociones
- **Estado:** ✅ Completa
- **Features:** Scroll animado, responsive design

#### 2. **MENU - /menu**
- **Descripción:** Catálogo completo del menú
- **Features:**
  - Filtrado por categoría
  - Búsqueda de items
  - Vista de tarjetas con imágenes
  - Agregar al carrito directamente
  - Modal con detalles del item
- **Estado:** ✅ Completa
- **Datos:** Consumo de API `/api/menu`

#### 3. **ABOUT - /about**
- **Descripción:** Información sobre el restaurante
- **Contenido:** Historia, misión, visión, valores
- **Estado:** ✅ Completa

#### 4. **SERVICES - /services**
- **Descripción:** Servicios ofrecidos
- **Servicios incluidos:** Alimentación, eventos, catering, delivery
- **Estado:** ✅ Completa

#### 5. **EVENTS - /events**
- **Descripción:** Solicitud de eventos y catering
- **Features:**
  - Formulario de solicitud
  - Galería de eventos pasados
  - Modal de confirmación
- **Estado:** ✅ Completa
- **API:** POST `/api/events` (almacena en EventRequest)

#### 6. **GALLERY - /gallery**
- **Descripción:** Galería de fotos del restaurante
- **Features:** Lightbox, filtrado
- **Estado:** ✅ Completa

#### 7. **CONTACT - /contact**
- **Descripción:** Formulario de contacto
- **Campos:** nombre, email, teléfono, mensaje
- **Estado:** ✅ Completa
- **API:** POST `/api/contact`

#### 8. **LOGIN - /login**
- **Descripción:** Inicio de sesión para clientes
- **Features:**
  - Validación de formulario
  - Manejo de errores
  - Redirección post-login
- **Estado:** ✅ Completa
- **API:** POST `/api/auth/login`

#### 9. **REGISTER - /register**
- **Descripción:** Registro de nuevos usuarios
- **Campos:** email, password, name, phone (opcional)
- **Estado:** ✅ Completa
- **API:** POST `/api/auth/register`

#### 10. **CART - /cart**
- **Descripción:** Carrito de compras (guest friendly)
- **Features:**
  - Agregar/eliminar items
  - Modificar cantidades
  - Cálculo de total
  - Aplicar cupones (solo vista)
- **Estado:** ✅ Completa
- **Persistencia:** localStorage
- **Requiere login para:** Checkout

#### 11. **RESERVATIONS - /reservations**
- **Descripción:** Sistema de reservas de mesas
- **Features:**
  - Selector de fecha/hora
  - Cantidad de huéspedes
  - Selección de mesa
  - Notas especiales
  - Calendario integrado
- **Estado:** ✅ Completa
- **API:** POST `/api/reservations`

---

### ✅ VISTAS PROTEGIDAS (Requieren autenticación)

#### 12. **CHECKOUT - /checkout**
- **Descripción:** Proceso de pago
- **Features:**
  - Resumen de orden
  - Múltiples métodos de pago (card, cash, transfer)
  - Validación de datos
  - Confirmación final
- **Estado:** ✅ Completa
- **Requiere:** PrivateRoute
- **API:** POST `/api/orders`, POST `/api/payments`

#### 13. **MY ORDERS - /my-orders**
- **Descripción:** Historial de órdenes del usuario
- **Features:**
  - Lista de órdenes con estado
  - Filtrado por estado
  - Búsqueda
  - Re-order (pedir de nuevo)
- **Estado:** ✅ Completa
- **API:** GET `/api/orders`

#### 14. **ORDER TRACKING - /track/:orderId**
- **Descripción:** Rastreo en tiempo real de orden
- **Features:**
  - Timeline del estado
  - Información de entrega (si aplica)
  - Detalles de items
  - Contacto del restaurante
- **Estado:** ✅ Completa
- **API:** GET `/api/orders/:id`, GET `/api/delivery/:orderId`

#### 15. **MY RESERVATIONS - /my-reservations**
- **Descripción:** Historial de reservas del usuario
- **Features:**
  - Lista de reservas próximas
  - Historial de pasadas
  - Cancelación con confirmación
  - Modificación de reservas
- **Estado:** ✅ Completa
- **API:** GET `/api/reservations`, PUT/DELETE `/api/reservations/:id`

#### 16. **PROFILE - /profile**
- **Descripción:** Perfil de usuario
- **Features:**
  - Editar información personal
  - Cambiar contraseña
  - Dirección(es) de entrega
  - Preferencias
  - Cerrar sesión
- **Estado:** ✅ Completa
- **API:** PUT `/api/users/:id`, POST `/api/users/:id/change-password`

#### 17. **BOOKING CONFIRMATION - /booking-confirmation**
- **Descripción:** Confirmación después de reserva
- **Features:** Resumen de reserva, QR, referencia
- **Estado:** ✅ Completa

---

### 👨‍💼 VISTAS ADMIN (Requieren rol admin/staff)

#### 18. **ADMIN LOGIN - /admin/login**
- **Descripción:** Login separado para administradores
- **Features:** Validación especial para admin
- **Estado:** ✅ Completa
- **API:** POST `/api/auth/login` (con validación de rol)

#### 19. **ADMIN DASHBOARD - /admin**
- **Descripción:** Panel principal con métricas
- **Gráficas y Métricas:**
  - Ventas totales del día/mes/año
  - Órdenes completadas
  - Reservas confirmadas
  - Clientes activos
  - Gráficos de tendencias
- **Estado:** ✅ Completa
- **API:** GET `/api/admin/analytics`

#### 20. **ADMIN ORDERS - /admin/orders**
- **Descripción:** Gestión de órdenes
- **Features:**
  - Lista de todas las órdenes
  - Filtrado por estado
  - Búsqueda
  - Cambiar estado (pendiente → confirmada → preparando → lista → entregada)
  - Ver detalles completos
- **Estado:** ✅ Completa
- **API:** GET `/api/orders`, PUT `/api/orders/:id`

#### 21. **ADMIN CLIENTS - /admin/clients**
- **Descripción:** Gestión de clientes
- **Features:**
  - Lista de usuarios
  - Búsqueda por nombre/email
  - Ver historial de órdenes
  - Ver reservas
  - Filtrado por rol
- **Estado:** ✅ Completa
- **Requiere:** admin role
- **API:** GET `/api/admin/users`

#### 22. **ADMIN TABLES - /admin/tables**
- **Descripción:** Gestión de mesas
- **Features:**
  - Lista de mesas con capacidad
  - Ver estado (disponible/ocupada/mantenimiento)
  - Crear nueva mesa
  - Editar capacidad
  - Marcar como mantenimiento
- **Estado:** ✅ Completa
- **API:** GET /PUT `/api/admin/tables`

#### 23. **ADMIN TABLE BILLS - /admin/table-bills**
- **Descripción:** Gestión de cuentas de mesa (para servicio en mesa)
- **Features:**
  - Bills activos por mesa
  - Agregar items a cuenta
  - Calcular propina
  - Dividir cuenta
  - Procesar pago
- **Estado:** ✅ Completa
- **API:** GET POST `/api/admin/table-bills`

#### 24. **ADMIN CASH REGISTER - /admin/cash**
- **Descripción:** Caja registradora digital
- **Features:**
  - Entrada/salida de efectivo
  - Arqueo de caja
  - Movimientos del día
  - Cierre de caja
  - Reporte de transacciones
- **Estado:** ✅ Completa
- **API:** GET POST `/api/admin/cash-register`

#### 25. **ADMIN INVENTORY - /admin/inventory**
- **Descripción:** Control de inventario
- **Features:**
  - Lista de items con stock
  - Alertas de bajo stock
  - Agregar/editar items
  - Registrar entradas/salidas
  - Historial de movimientos
- **Estado:** ✅ Completa
- **Requiere:** admin role
- **API:** GET PUT POST `/api/admin/inventory`

#### 26. **ADMIN DELIVERY - /admin/delivery**
- **Descripción:** Gestión de entregas
- **Features:**
  - Órdenes con delivery
  - Asignación de repartidor (conceptual)
  - Rastreo de entregas
  - Cambiar estado
  - Contacto con cliente
- **Estado:** ✅ Completa
- **API:** GET PUT `/api/admin/delivery`

---

## 🔐 Configuración y Credenciales

### Variables de Entorno - Frontend

**Archivo:** `.env` (frontend root)
```env
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant01
VITE_APP_VERSION=0.1.0
```

**Descripción:**
- `VITE_API_URL` - URL base para llamadas API (cambiar en producción)
- `VITE_APP_NAME` - Nombre de la aplicación
- `VITE_APP_VERSION` - Versión del frontend

### Variables de Entorno - Backend

**Archivo:** `backend/.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://mongo:Pantonio2404@mongo-dev.nauvolan.abrdns.com:27017/?tls=true&tlsCAFile=/home/nauvolanl/Nextcloud/Projects/Restaurant01/backend/mongo-cert.crt&authSource=admin&tlsAllowInvalidCertificates=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Descripción:**
- `PORT` - Puerto del servidor backend
- `NODE_ENV` - development/production
- `MONGODB_URI` - Conexión a MongoDB (con autenticación TLS)
- `JWT_SECRET` - Llave secreta para tokens (⚠️ **CAMBIAR EN PRODUCCIÓN**)
- `JWT_EXPIRES_IN` - Duración del token
- `FRONTEND_URL` - Para CORS (permitir requests desde frontend)

### Credenciales MongoDB
```
Usuario: mongo
Contraseña: Pantonio2404
Host: mongo-dev.nauvolan.abrdns.com
Puerto: 27017
Database: restaurant01
Autenticación: TLS habilitado
Certificado: backend/mongo-cert.crt
```

### Credenciales de Prueba (Para testing)

**Usuario Admin predeterminado:**
```
Email: admin@restaurant01.com
Contraseña: AdminPassword123
Rol: admin
```

**Usuario Regular de prueba:**
```
Email: user@restaurant01.com
Contraseña: UserPassword123
Rol: user
```

⚠️ **Nota:** Estos usuarios deben crearse manualmente en la BD o modificar el seed.

---

## 💾 Base de Datos

### Información de Conexión
```
Tipo:         MongoDB
Host:         mongo-dev.nauvolan.abrdns.com
Puerto:       27017
Usuario:      mongo
Contraseña:   Pantonio2404
TLS:          Habilitado (obligatorio)
Database:     restaurant01
```

### Colecciones y Esquemas

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (único),
  password: String (hasheado con bcrypt),
  name: String,
  phone: String,
  role: String (enum: ['admin', 'staff', 'user']),
  addresses: [{
    label: String,
    street: String,
    city: String,
    zipCode: String,
    default: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **MenuItems Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String (ej: appetizers, main, desserts),
  image: String (URL o base64),
  available: Boolean,
  preparationTime: Number (minutos),
  ingredients: [String],
  allergens: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Orders Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    menuItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: String (enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  paymentMethod: String (cash, card, transfer),
  deliveryType: String (pickup, delivery),
  deliveryAddress: Object,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Reservations Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  time: String,
  guests: Number,
  tableId: ObjectId (ref: Table),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  notes: String,
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Tables Collection**
```javascript
{
  _id: ObjectId,
  number: Number (1-50),
  capacity: Number,
  status: String (enum: ['available', 'occupied', 'maintenance']),
  location: String (ej: window, center),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Payments Collection**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  amount: Number,
  method: String (cash, card, transfer),
  status: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  transactionId: String,
  timestamp: Date,
  createdAt: Date
}
```

#### **Delivery Collection**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  address: Object,
  status: String (enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered']),
  driverId: ObjectId (futuro),
  estimatedTime: Date,
  actualTime: Date,
  location: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **CashRegister Collection**
```javascript
{
  _id: ObjectId,
  date: Date,
  status: String (open, closed),
  openBalance: Number,
  closeBalance: Number,
  totalIncome: Number,
  totalExpense: Number,
  transactions: [ObjectId] (ref: Transaction),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Otros Modelos**
- **Contact:** Mensajes de formulario de contacto
- **EventRequest:** Solicitudes de eventos y catering
- **InventoryItem:** Items del inventario
- **Image:** Imágenes del restaurante
- **TableBill:** Cuentas por mesa
- **Transaction:** Transacciones de caja

---

## 🔄 Flujos de Datos

### 1. Flujo de Registro e Inicio de Sesión
```
Usuario → Frontend (/register)
    ↓
  Formulario validado
    ↓
API POST /auth/register
    ↓
Backend → Hash password (bcrypt) → Crear usuario en BD
    ↓
Retorna JWT token + user data
    ↓
Frontend → Guardar token en localStorage
Frontend → Guardar user en AuthContext
    ↓
Redireccionar a Home
```

### 2. Flujo de Compra
```
Usuario → Navega a /menu
    ↓
Frontend API GET /menu
    ↓
Visualiza items → Agrega al carrito (CartContext)
    ↓
Navega a /cart
    ↓
Revisa items, cantidad, total
    ↓
Click "Checkout" → Redirige a /checkout (PrivateRoute)
    ↓
Si no está logueado → Redirige a /login
    ↓
En checkout:
  - Selecciona método de pago
  - Confirma dirección
    ↓
POST /api/orders (crea orden)
POST /api/payments (procesa pago)
    ↓
Backend → Valida datos → Crea documents en BD
    ↓
Retorna orden confirmada
    ↓
Frontend → Redirige a /my-orders
Usuario → Puede rastrear en /track/:orderId
```

### 3. Flujo de Reserva
```
Usuario → Navega a /reservations (público)
    ↓
Completa formulario:
  - Fecha/hora
  - Cantidad de huéspedes
  - Preferencias de mesa
    ↓
Click "Reservar"
    ↓
Si no logueado → Redirige a /login
    ↓
POST /api/reservations
    ↓
Backend:
  - Valida disponibilidad de mesa
  - Valida horario
  - Crea Reservation document
    ↓
Retorna confirmación
    ↓
Frontend → Redirige a /booking-confirmation
    ↓
Usuario logueado puede ver en /my-reservations
```

### 4. Flujo Admin - Gestión de Órdenes
```
Admin → Navega a /admin/orders (AdminRoute)
    ↓
Frontend GET /api/orders (todas)
    ↓
Visualiza lista de órdenes con estado
    ↓
Puede:
  - Filtrar por estado
  - Buscar por ID/cliente
  - Click en orden → Ver detalles
  - Cambiar estado (pending → confirmed → preparing → ready → delivered)
    ↓
PUT /api/orders/:id { status: 'preparing' }
    ↓
Backend actualiza documento
    ↓
Frontend actualiza lista
    ↓
Si hay delivery → Admin puede ver en /admin/delivery
    ↓
Cambiar tracking status
```

### 5. Flujo de Autenticación
```
Petición HTTP → Express Middleware
    ↓
¿Ruta protegida? (/api/admin/*, /api/orders auth required)
    ↓
Verificar header: Authorization: Bearer <token>
    ↓
Validar JWT (JWT_SECRET)
    ↓
Si válido → Extraer userId, rol
    ↓
Cargar usuario de BD
    ↓
Verificar rol/permisos
    ↓
✅ Autorizado → Continuar
❌ Denegado → 401/403 error
```

---

## ✅ Checklist de Funcionalidades

### Funcionalidades IMPLEMENTADAS ✅

#### Cliente - Públicas
- [x] Página de inicio (Home) con hero, testimonios
- [x] Menú dinámico con filtrado y búsqueda
- [x] Página About
- [x] Página Services
- [x] Galería de fotos
- [x] Formulario de contacto
- [x] Solicitud de eventos y catering
- [x] Registro de usuarios
- [x] Inicio de sesión
- [x] Carrito de compras (guest + autenticado)

#### Cliente - Autenticadas (PrivateRoute)
- [x] Checkout con múltiples métodos de pago
- [x] Historial de órdenes (My Orders)
- [x] Rastreo en tiempo real de orden
- [x] Sistema de reservas de mesa
- [x] Historial de reservas (My Reservations)
- [x] Perfil de usuario (editar datos, cambiar contraseña)
- [x] Confirmación de booking

#### Admin - Autenticadas (AdminRoute)
- [x] Login separado para admin
- [x] Dashboard con métricas y gráficas
- [x] Gestión de órdenes (ver, filtrar, cambiar estado)
- [x] Gestión de clientes (listar, filtrar, ver historial)
- [x] Gestión de mesas (crear, editar, ver estado)
- [x] Gestión de cuentas por mesa (table bills)
- [x] Caja registradora digital (movimientos, arqueo)
- [x] Control de inventario
- [x] Rastreo de delivery
- [x] Reportes básicos

#### Características Técnicas
- [x] Autenticación JWT
- [x] Hash de contraseñas (bcrypt)
- [x] CORS configurado
- [x] Rate limiting básico
- [x] Mongoose sanitization
- [x] Helmet security headers
- [x] Swagger API docs
- [x] TypeScript en ambos lados
- [x] Tests configurados (Vitest)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Componentes Radix UI
- [x] Tailwind CSS

---

### Funcionalidades NO IMPLEMENTADAS ❌

#### Cliente
- [ ] Notificaciones push
- [ ] Chat en vivo con soporte
- [ ] Programas de lealtad/puntos
- [ ] Wishlist/favoritos
- [ ] Integración de redes sociales
- [ ] Login social (Google, Facebook)
- [ ] Reseñas y ratings

#### Admin
- [ ] Reportes avanzados (PDF, Excel)
- [ ] Integración con sistemas de pago reales (Stripe, PayU)
- [ ] SMS/Email automático de confirmación
- [ ] Asignación automática de delivery
- [ ] Análisis predictivo de ventas
- [ ] Integración con sistemas de cocina

#### Backend
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Caché (Redis)
- [ ] Queue de tareas (Bull, Celery)
- [ ] Tests con 100% coverage
- [ ] Database migrations system

---

## ⚠️ Consideraciones Importantes

### 🔴 CRÍTICO

1. **JWT_SECRET en producción**
   - ⚠️ El secret actual es débil
   - **Acción:** Generar nueva key con:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - **Ubicación:** Guardar en secret management (AWS Secrets Manager, HashiCorp Vault, etc.)

2. **Certificado SSL/TLS para MongoDB**
   - **Ubicación actual:** `backend/mongo-cert.crt`
   - **Riesgo:** Si el certificado expira, la conexión falla
   - **Acción:** Monitorear expiración, renovar 30 días antes

3. **Base de datos no respaldada automáticamente**
   - **Riesgo:** Pérdida de datos
   - **Acción:**
     - Implementar backup automático diario
     - Usar MongoDB Atlas en lugar de servidor manual
     - Mantener backup en múltiples ubicaciones

4. **Sin autenticación multi-factor (MFA)**
   - **Para producción:** Implementar TOTP o SMS 2FA
   - **Prioridad:** Media-Alta

### 🟡 IMPORTANTE

5. **Métodos de pago no reales**
   - **Actual:** Mock de pagos (no procesa reales)
   - **Para producción:** Integrar con Stripe, PayU o similar
   - **Timeline:** Antes de ir a producción

6. **Sin emails automáticos**
   - **Falta:** Confirmación de registro, orden, reserva
   - **Solución:** Integrar SendGrid, AWS SES o Nodemailer
   - **Componentes:** auth signup, order confirmation, reservation

7. **Sin monitoreo y logging**
   - **Falta:** Logs centralizados, error tracking
   - **Soluciones recomendadas:**
     - Sentry para error tracking
     - ELK Stack o CloudWatch para logs
     - New Relic para performance monitoring

8. **CORS muy permisivo en desarrollo**
   - **Actual:** Funciona localmente
   - **Para producción:** Restringir a dominio específico

9. **Sin rate limiting robusto**
   - **Riesgo:** Brute force attacks
   - **Acción:** Aumentar límites, implementar CAPTCHA para login/register

10. **Base de datos en desarrollo**
    - **MONGODB_URI:** Apunta a servidor de desarrollo
    - **Para producción:** Usar base de datos dedicada/managed

### 🟢 BUENAS PRÁCTICAS IMPLEMENTADAS ✅

- Autenticación con JWT
- Passwords hasheados con bcrypt
- Validación de inputs (express-validator)
- Mongoose sanitization
- CORS habilitado
- Helmet para security headers
- TypeScript para type safety
- Tests configurados
- Componentes UI accesibles (Radix UI)
- Responsive design

---

## 🚀 Instrucciones de Acceso

### Requerimientos Previos
```bash
# Verificar Node.js
node --version  # Debe ser 18+

# Verificar pnpm
pnpm --version  # O usar npm/yarn
```

### Instalación y Ejecución Automática

**Opción 1: Script automático (Recomendado)**
```bash
cd c:\Users\pagar\Nextcloud\Projects\Restaurant01
./start.sh
```

El script hace:
- ✅ Instala dependencias (si no existen)
- ✅ Inicia backend en terminal 1
- ✅ Inicia frontend en terminal 2
- Abre automáticamente http://localhost:3000

### Instalación y Ejecución Manual

**Terminal 1 - Backend**
```bash
cd backend
pnpm install      # Primera vez
pnpm build        # Compilar TypeScript
pnpm start        # O: node dist/server.js
```

**Terminal 2 - Frontend**
```bash
pnpm install      # Primera vez
pnpm dev
```

### URLs de Acceso

| Componente | URL | Notas |
|-----------|-----|-------|
| Frontend | http://localhost:3000 | Aplicación principal |
| Backend API | http://localhost:5000 | API base |
| API Docs (Swagger) | http://localhost:5000/api/docs | Documentación interactiva |

### Navegación Rápida

**Como Cliente:**
1. Accede a http://localhost:3000
2. Haz click en "Menu" para ver catálogo
3. Agrega items al carrito
4. Haz click en "Checkout" → Serás redirigido a login
5. Regístrate o inicia sesión
6. Completa la compra
7. Ve a "My Orders" para rastrear

**Como Admin:**
1. Accede a http://localhost:3000/admin/login
2. Usa credenciales admin
3. Accede al dashboard
4. Navega entre paneles (órdenes, clientes, inventario, etc.)

### Troubleshooting Común

**Puerto 3000/5000 en uso:**
```bash
# Frontend puerto diferente
PORT=3001 pnpm dev

# Backend puerto diferente
PORT=5001 pnpm start
```

**MongoDB no conecta:**
- Verificar credenciales en `backend/.env`
- Verificar certificado en `backend/mongo-cert.crt`
- Verificar conectividad de red

**CORS errors:**
- Verificar `VITE_API_URL` en `.env` frontend
- Verificar `FRONTEND_URL` en `backend/.env`

---

## 📊 Resumen de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  CLIENTE (USUARIO)                   │
└────────────────┬────────────────────────────────────┘
                 │
         HTTP + JSON (axios/fetch)
                 │
┌────────────────▼────────────────────────────────────┐
│            FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Pages (18 públicas + 10 admin)                    │
│  │                                                  │
│  ├─ Auth: Login, Register                          │
│  ├─ Shop: Menu, Cart, Checkout, Orders             │
│  ├─ Reservations: Book, My Reservations            │
│  ├─ Admin: Dashboard, Orders, Inventory            │
│  └─ General: Home, About, Contact, Gallery         │
│                                                      │
│  Context Providers:                                │
│  ├─ AuthContext (usuario, login/logout)           │
│  ├─ CartContext (carrito)                          │
│  ├─ OrdersContext (órdenes)                        │
│  └─ ReservationsContext (reservas)                 │
│                                                      │
└────────────────┬────────────────────────────────────┘
                 │
      REST API + JWT Bearer Token
                 │
┌────────────────▼────────────────────────────────────┐
│            BACKEND (Express + Node.js)               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Routes (12 archivos):                             │
│  ├─ auth.routes         → AuthController           │
│  ├─ user.routes         → UserController           │
│  ├─ menu.routes         → MenuController           │
│  ├─ order.routes        → OrderController          │
│  ├─ reservation.routes  → ReservationController    │
│  ├─ payment.routes      → PaymentController        │
│  ├─ contact.routes      → ContactController        │
│  ├─ delivery.routes     → DeliveryController       │
│  └─ admin/* (routes)    → AdminControllers         │
│                                                      │
│  Middleware:                                       │
│  ├─ JWT Auth Validation                           │
│  ├─ Role-based Access Control                     │
│  ├─ Mongoose Sanitization                         │
│  ├─ Rate Limiting                                 │
│  └─ Error Handling                                │
│                                                      │
│  Models (13 MongoDB Schemas):                     │
│  ├─ User                                          │
│  ├─ MenuItem                                      │
│  ├─ Order                                         │
│  ├─ Reservation                                   │
│  ├─ Table                                         │
│  ├─ Payment                                       │
│  ├─ Delivery                                      │
│  ├─ CashRegister / Transaction                    │
│  ├─ InventoryItem                                 │
│  └─ [8 modelos más]                               │
│                                                      │
└────────────────┬────────────────────────────────────┘
                 │
          Mongoose ODM + TLS
                 │
┌────────────────▼────────────────────────────────────┐
│     BASE DE DATOS (MongoDB - servidor remoto)       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Host: mongo-dev.nauvolan.abrdns.com:27017        │
│  User: mongo:Pantonio2404                         │
│  Database: restaurant01                            │
│  Collections: 13 (Users, Orders, Menus, etc)      │
│  Backup: ⚠️ MANUAL - Implementar automático        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📞 Contacto y Soporte

**Estado:** MVP completado y funcional
**Última actualización:** 2026-04-04
**Desarrollado:** GitHub Copilot (desarrolladores anteriores)
**Mantenido por:** Nuevo Product Manager

Para preguntas o problemas, contactar al equipo de desarrollo.

---

**Documento generado automáticamente - 2026-04-04**
