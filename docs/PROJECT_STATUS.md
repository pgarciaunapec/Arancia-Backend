# 📋 ESTADO DEL PROYECTO RESTAURANT01 - Documentación Completa

**Actualizado:** 4 de Abril, 2026  
**Rama activa:** `copilot/complete-mvp-preparation`  
**Estado General:** ✅ **MVP COMPLETADO Y FUNCIONAL**

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Global](#arquitectura-global)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estado de Backend](#estado-de-backend)
5. [Estado de Frontend](#estado-de-frontend)
6. [Guía de Acceso a Vistas](#guía-de-acceso-a-vistas)
7. [Autenticación y Credenciales](#autenticación-y-credenciales)
8. [Base de Datos](#base-de-datos)
9. [Funcionalidades por Rol](#funcionalidades-por-rol)
10. [Flujos Principal de la Aplicación](#flujos-principales-de-la-aplicación)
11. [Funcionalidades Completadas](#funcionalidades-completadas)
12. [Funcionalidades Pendientes](#funcionalidades-pendientes)
13. [Consideraciones Importantes](#consideraciones-importantes)
14. [Guía de Inicio](#guía-de-inicio)

---

## 🎯 Resumen Ejecutivo

**Restaurant01** es un sistema completo de gestión de restaurante con las siguientes características:

### Usuarios Finales (Clientes)
- ✅ Autenticación segura con JWT
- ✅ Menú dinámico con categorías
- ✅ Carrito de compras (invitado y autenticado)
- ✅ Checkout con múltiples métodos de pago
- ✅ Rastreo de órdenes en tiempo real
- ✅ Reservas de mesa
- ✅ Historial de pedidos y reservaciones
- ✅ Perfil de usuario personalizado

### Administración
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de menús y precios
- ✅ Gestión de órdenes (estado, delivery, preparación)
- ✅ Gestión de mesas y reservaciones
- ✅ Control de inventario
- ✅ Caja registradora digital
- ✅ Módulo de delivery
- ✅ Génesis de reportes y análisis

---

## 🏗️ Arquitectura Global

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (NAVEGADOR)                     │
│  http://localhost:3000                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────────┐┌──────────┐┌────────────────────┐
    │  Frontend  ││ React + │ │ Vite + TypeScript │
    │          ││ Tailwind│ │ Radix-UI Components│
    │ (SPA)     ││ + Radix │ │ Context API       │
    └────────────┘└──────────┘└────────────────────┘
        │
        │  HTTP REST API
        │  Bearer Token (JWT)
        │
    ┌───▼──────────────────────────────────────────┐
    │        BACKEND API (Express + Node)          │
    │      http://localhost:5000                   │
    │      Documentación: /api/docs (Swagger)      │
    └───┬──────────────────────────────────────────┘
        │
        │  Mongoose ODM
        │
    ┌───▼──────────────────────────────────────────┐
    │       MongoDB (Base de Datos Remota)         │
    │  mongo-dev.nauvolan.abrdns.com:27017        │
    │  Conexión SSL/TLS con Certificado           │
    └──────────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

### Frontend
| Componente | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | - | Build tool y dev server |
| **TypeScript** | - | Type safety |
| **React Router** | - | Enrutamiento |
| **Tailwind CSS** | - | Estilos y diseño |
| **Radix UI** | Múltiples v1.x | Componentes accesibles |
| **React Hook Form** | 7.55.0 | Gestión de formularios |
| **Recharts** | 2.15.2 | Gráficos |
| **Sonner** | 2.0.3 | Toast notifications |
| **Embla Carousel** | 8.6.0 | Carousels |
| **next-themes** | 0.4.6 | Dark mode |

### Backend
| Componente | Versión | Propósito |
|-----------|---------|----------|
| **Express** | 4.21.0 | Framework HTTP |
| **TypeScript** | 5.5.4 | Type safety |
| **Mongoose** | 8.6.0 | ODM para MongoDB |
| **JWT** | 9.0.2 | Autenticación |
| **bcryptjs** | 2.4.3 | Hash de contraseñas |
| **Helmet** | 8.1.0 | Seguridad HTTP |
| **CORS** | 2.8.5 | Cross-Origin |
| **Express Validator** | 7.2.0 | Validación |
| **Swagger/OpenAPI** | 6.2.8 | Documentación API |

---

## 🔧 Estado de Backend

### URLs y Puertos
```
API Base:      http://localhost:5000/api
Health Check:  http://localhost:5000/api/health
Swagger Docs:  http://localhost:5000/api/docs
Node Env:      development
```

### Rutas Implementadas

#### 🔐 Autenticación (`/api/auth`)
- ✅ `POST /register` - Registrar nuevo usuario
- ✅ `POST /login` - Login con email/password
- ✅ `POST /admin/login` - Login para admin/staff
- ✅ `GET /me` - Obtener perfil actual (autenticado)
- ✅ `POST /logout` - Logout (frontend)
- ✅ `PATCH /change-password` - Cambiar contraseña

#### 👥 Usuarios (`/api/users`)
- ✅ `GET /` - Listar usuarios (con filtros)
- ✅ `GET /:id` - Obtener usuario específico
- ✅ `PATCH /:id` - Actualizar perfil
- ✅ `DELETE /:id` - Eliminar usuario

#### 🍽️ Menú (`/api/menu`)
- ✅ `GET /` - Listar todos los items
- ✅ `GET /categories` - Listar categorías
- ✅ `GET /:id` - Obtener item específico
- ✅ `POST /` - Crear item (admin)
- ✅ `PATCH /:id` - Actualizar item (admin)
- ✅ `DELETE /:id` - Eliminar item (admin)

#### 🛒 Carrito (`/api/cart`)
- ✅ `GET /` - Ver carrito (guest/autenticado)
- ✅ `POST /add` - Agregar item
- ✅ `PATCH /update/:itemId` - Actualizar cantidad
- ✅ `DELETE /remove/:itemId` - Remover item
- ✅ `DELETE /clear` - Limpiar carrito

#### 📦 Órdenes (`/api/orders`)
- ✅ `POST /` - Crear orden
- ✅ `GET /` - Listar órdenes (usuario)
- ✅ `GET /:id` - Obtener detalle de orden
- ✅ `PATCH /:id/status` - Actualizar estado (admin)
- ✅ `DELETE /:id` - Cancelar orden

#### 🍴 Reservaciones (`/api/reservations`)
- ✅ `POST /` - Crear reservación
- ✅ `GET /` - Listar reservaciones (usuario)
- ✅ `GET /:id` - Obtener detalle
- ✅ `PATCH /:id` - Actualizar reservación
- ✅ `DELETE /:id` - Cancelar reservación
- ✅ `GET /available` - Mesas/horarios disponibles

#### 💳 Pagos (`/api/payments`)
- ✅ `POST /` - Procesar pago
- ✅ `GET /:id` - Estado de pago
- ✅ `POST /refund/:id` - Devolución

#### 📧 Contacto (`/api/contact`)
- ✅ `POST /` - Enviar mensaje de contacto
- ✅ `GET /` - Ver mensajes (admin)

#### 🚚 Delivery (`/api/delivery`)
- ✅ `GET /` - Listar entregas
- ✅ `POST /` - Crear entrega
- ✅ `PATCH /:id/status` - Actualizar estado

#### 🖼️ Imágenes (`/api/images`)
- ✅ `POST /upload` - Subir imagen
- ✅ `GET /:id` - Obtener imagen

#### 📊 Admin Routes

**Usuarios Admin** (`/api/admin/users`)
- ✅ `GET /` - Listar todos los usuarios
- ✅ `GET /:id` - Obtener usuario
- ✅ `PATCH /:id` - Actualizar usuario
- ✅ `DELETE /:id` - Eliminar usuario

**Mesas** (`/api/admin/tables`)
- ✅ `GET /` - Listar mesas
- ✅ `POST /` - Crear mesa
- ✅ `PATCH /:id` - Actualizar mesa
- ✅ `DELETE /:id` - Eliminar mesa

**Cuentas de Mesa** (`/api/admin/table-bills`)
- ✅ `GET /` - Listar cuentas
- ✅ `POST /` - Crear cuenta
- ✅ `PATCH /:id` - Actualizar
- ✅ `DELETE /:id` - Eliminar

**Caja Registradora** (`/api/admin/cash-register`)
- ✅ `GET /` - Estado de caja
- ✅ `POST /open` - Abrir caja
- ✅ `POST /close` - Cerrar caja
- ✅ `GET /transactions` - Historial

**Inventario** (`/api/admin/inventory`)
- ✅ `GET /` - Ver inventario
- ✅ `POST /` - Agregar item
- ✅ `PATCH /:id` - Actualizar cantidad
- ✅ `DELETE /item/:id` - Remover item

**Dashboard** (`/api/admin/dashboard`)
- ✅ `GET /stats` - Estadísticas generales
- ✅ `GET /sales` - Datos de ventas
- ✅ `GET /orders-status` - Estado de órdenes

**Órdenes Admin** (`/api/admin/orders`)
- ✅ `GET /` - Listar todas las órdenes
- ✅ `GET /:id` - Detalle de orden
- ✅ `PATCH /:id/status` - Cambiar estado
- ✅ `DELETE /:id` - Cancelar orden

**Delivery Admin** (`/api/admin/delivery`)
- ✅ `GET /` - Listar entregas
- ✅ `PATCH /:id/status` - Actualizar estado
- ✅ `GET /stats` - Estadísticas

### Modelos de MongoDB

```typescript
// Usuario
User {
  _id: ObjectId
  name: string
  email: string (único)
  password: string (hasheado)
  phone?: string
  address?: string
  role: 'customer' | 'staff' | 'admin'
  isVIP: boolean
  loyaltyPoints: number
  createdAt: timestamp
  updatedAt: timestamp
}

// Item de Menú
MenuItem {
  _id: ObjectId
  name: string
  category: string
  description: string
  price: number
  image: string
  ingredients: string[]
  isAvailable: boolean
  createdAt: timestamp
  updatedAt: timestamp
}

// Orden
Order {
  _id: ObjectId
  userId: ObjectId (ref: User)
  items: [{
    name: string
    price: number
    quantity: number
    menuItemId: ObjectId
  }]
  subtotal: number
  tax: number
  total: number
  status: 'pending'|'confirmed'|'preparing'|'ready'|'delivering'|'delivered'|'cancelled'
  deliveryType: 'delivery'|'pickup'|'dine-in'
  deliveryAddress?: string
  estimatedMinutes?: number
  createdAt: timestamp
  updatedAt: timestamp
}

// Reservación
Reservation {
  _id: ObjectId
  userId: ObjectId (ref: User)
  date: Date
  time: string
  guestCount: number
  specialRequests?: string
  status: 'pending'|'confirmed'|'cancelled'
  tableId?: ObjectId (ref: Table)
  createdAt: timestamp
  updatedAt: timestamp
}

// Mesa
Table {
  _id: ObjectId
  number: number (único)
  capacity: number
  section?: string
  isAvailable: boolean
  createdAt: timestamp
  updatedAt: timestamp
}

// Payment/Transacción
Payment {
  _id: ObjectId
  orderId: ObjectId (ref: Order)
  userId: ObjectId (ref: User)
  amount: number
  tax: number
  total: number
  method: 'card'|'cash'|'transfer'
  status: 'pending'|'paid'|'failed'|'refunded'
  cardLast4?: string
  createdAt: timestamp
  updatedAt: timestamp
}

// Inventario
InventoryItem {
  _id: ObjectId
  name: string
  quantity: number
  unit: string
  minStock: number
  lastRestocked: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}

// Caja Registradora
CashRegister {
  _id: ObjectId
  openingBalance: number
  closingBalance?: number
  openedAt: timestamp
  closedAt?: timestamp
  transactions: [{
    type: 'sale'|'refund'|'deposit'|'withdrawal'
    amount: number
    description: string
    timestamp: timestamp
  }]
}

// Orden de Entrega
DeliveryOrder {
  _id: ObjectId
  orderId: ObjectId (ref: Order)
  address: string
  status: 'pending'|'assigned'|'in_transit'|'delivered'
  driver?: string
  estimatedTime?: number
  actualTime?: number
  createdAt: timestamp
  updatedAt: timestamp
}

// Contacto
Contact {
  _id: ObjectId
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new'|'read'|'responded'
  createdAt: timestamp
  updatedAt: timestamp
}

// Solicitud de Evento
EventRequest {
  _id: ObjectId
  name: string
  email: string
  date: Date
  guestCount: number
  eventType: string
  message?: string
  status: 'pending'|'approved'|'rejected'
  createdAt: timestamp
  updatedAt: timestamp
}

// Factura de Mesa
TableBill {
  _id: ObjectId
  tableId: ObjectId (ref: Table)
  items: [{
    name: string
    price: number
    quantity: number
  }]
  subtotal: number
  tax: number
  total: number
  status: 'open'|'paid'|'closed'
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 🎨 Estado de Frontend

### URLs Principales
```
Frontend:      http://localhost:3000
Build:         /build (contenido compilado)
Dev Server:    Vite dev mode
```

### Estructura de Carpetas

```
src/
├── components/          # Componentes React reutilizables
│   ├── guards/         # Route Guards (PrivateRoute, AdminRoute)
│   ├── ui/             # Componentes de UI (Radix-UI wrapped)
│   ├── figma/          # Componentes custom (ImageWithFallback)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TopNav.tsx
│   ├── Sidebar.tsx
│   ├── MobileSidebar.tsx
│   ├── Modal.tsx
│   └── [otros componentes]
│
├── pages/              # Páginas/Vistas principales
│   ├── admin/         # Vistas administrativas
│   ├── Home.tsx
│   ├── Menu.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── MyOrders.tsx
│   ├── OrderTracking.tsx
│   ├── Reservations.tsx
│   ├── MyReservations.tsx
│   └── [otras páginas]
│
├── context/            # Context API (State Management)
│   ├── AuthContext.tsx      # Autenticación y usuario
│   ├── CartContext.tsx      # Carrito de compras
│   ├── OrdersContext.tsx    # Órdenes
│   ├── ReservationsContext.tsx  # Reservaciones
│   └── AdminContext.tsx     # Estado Admin
│
├── lib/                # Utilidades y configuración
│   ├── api.ts         # Cliente HTTP y funciones API
│   └── mappers.ts     # Transformación de datos backend→frontend
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useMenu.ts
│   ├── useOrders.ts
│   ├── useReservations.ts
│   └── index.ts
│
├── types/              # Tipos TypeScript
│   └── index.ts        # Definiciones de tipos globales
│
├── styles/             # Estilos globales
│   └── globals.css
│
├── test/               # Configuración de tests
│   └── setup.ts
│
└── main.tsx           # Entry point
```

### Context API Structure

#### AuthContext
- Autenticación y gestión de usuario actual
- Login, Register, Logout, ChangePassword
- Admin role detection
- Persistencia en localStorage

#### CartContext
- Gestión del carrito (guest y autenticado)
- Add/Remove items
- Update quantity
- Clear cart
- Sincronización con backend (si autenticado)

#### OrdersContext
- Obtener órdenes del usuario
- Crear nueva orden
- Rastreo de orden
- Actualizar estado

#### ReservationsContext
- Obtener reservaciones del usuario
- Crear/actualizar/cancelar reservación
- Verificar disponibilidad de mesas
- Sugerir horarios

#### AdminContext
- Contexto compartido para módulos admin
- Dashboard data
- Real-time updates
- Admin form states

---

## 📍 Guía de Acceso a Vistas

### Vistas Públicas (Accesibles sin autenticación)

| Ruta | Nombre | Descripción | Protección |
|------|--------|-------------|-----------|
| `/` | Home | Página de inicio | Pública |
| `/menu` | Menú | Catálogo de platos | Pública |
| `/about` | Acerca de | Información del restaurante | Pública |
| `/services` | Servicios | Servicios ofrecidos | Pública |
| `/gallery` | Galería | Galería de fotos | Pública |
| `/events` | Eventos | Eventos especiales | Pública |
| `/contact` | Contacto | Formulario de contacto | Pública |
| `/cart` | Carrito | Ver/gestionar carrito | Pública |
| `/reservations` | Reservar Mesa | Hacer reservación | Pública |
| `/booking-confirmation` | Confirmación | Confirmación de reserva | Pública |
| `/login` | Login | Iniciar sesión Usuario | Pública |
| `/register` | Registro | Crear cuenta Usuario | Pública |

### Vistas Protegidas (Requieren autenticación como Customer)

| Ruta | Nombre | Descripción | Roles |
|------|--------|-------------|-------|
| `/checkout` | Checkout | Procesar pago | customer, admin, staff |
| `/profile` | Mi Perfil | Ver/editar perfil | customer, admin, staff |
| `/my-orders` | Mis Órdenes | Historial de órdenes | customer, admin, staff |
| `/track/:orderId` | Rastrear Orden | Detalle y rastreo en vivo | customer, admin, staff |
| `/my-reservations` | Mis Reservaciones | Historial de reservaciones | customer, admin, staff |

### Vistas Admin (Requieren autenticación como admin/staff)

| Ruta | Nombre | Descripción | Rol Requerido |
|------|--------|-------------|---------------|
| `/admin/login` | Admin Login | Login administrador | Público |
| `/admin` | Dashboard | Panel principal admin | admin, staff |
| `/admin/orders` | Gestión Órdenes | Listar/editar órdenes | admin, staff |
| `/admin/clients` | Gestión Clientes | Listar/editar clientes | admin |
| `/admin/tables` | Gestión Mesas | Mesas y reservaciones | admin, staff |
| `/admin/cash` | Caja Registradora | Control de caja | admin, staff |
| `/admin/inventory` | Inventario | Gestión de inventario | admin |
| `/admin/delivery` | Delivery | Seguimiento entregas | admin, staff |
| `/admin/table-bills` | Cuentas de Mesa | Control de cuentas | admin, staff |

### Mapa de Navegación

```
HOME (/)
├── PÚBLICO
│   ├── /menu → Menú completo (puede agregar al carrito)
│   ├── /about → Info restaurante
│   ├── /services → Servicios
│   ├── /gallery → Fotos
│   ├── /events → Eventos
│   ├── /contact → Contacto
│   ├── /login → Iniciar sesión
│   └── /register → Crear cuenta
│
├── SIN AUTENTICACIÓN
│   ├── /cart → Ver carrito (guest)
│   ├── /reservations → Hacer reservación (sin cuenta)
│   └── /booking-confirmation → Confirmación
│
└── CON AUTENTICACIÓN (usuario normal)
    ├── /checkout → Completar compra
    ├── /profile → Mi perfil
    ├── /my-orders → Mis pedidos
    ├── /track/:orderId → Rastrear pedido
    └── /my-reservations → Mis reservaciones

ADMIN PANEL (/admin)
├── /admin/login → Login admin
├── /admin → Dashboard (resumen)
├── /admin/orders → Órdenes (crear, editar, seguimiento)
├── /admin/clients → Clientes (listar, editar, eliminar)
├── /admin/tables → Mesas (crear, editar, reservaciones)
├── /admin/cash → Caja (abrir, cerrar, movimientos)
├── /admin/inventory → Inventario (stock, movimientos)
├── /admin/delivery → Entregas (asignar, rastrear)
└── /admin/table-bills → Cuentas de mesa (generar, pagar)
```

---

## 🔐 Autenticación y Credenciales

### Arquitectura de Autenticación

```
1. REGISTRO
   Usuario → POST /api/auth/register
   Backend → Hash password (bcryptjs)
   Backend → Guardar en MongoDB
   Response → Token JWT + User data

2. LOGIN
   Usuario → POST /api/auth/login (email + password)
   Backend → Verificar email existe
   Backend → Comparar password hasheado
   Backend → Generar JWT token
   Response → Token + User data
   Frontend → Guardar token en localStorage['restaurant_auth_token']

3. AUTHENTICATED REQUESTS
   Frontend → Agrega header: Authorization: Bearer {token}
   Backend → Verifica JWT signature
   Backend → Extrae usuario del payload
   Procesa request

4. LOGOUT
   Frontend → Elimina token de localStorage
   Frontend → Redirige a /login
   (No hay endpoint logout, es client-side)

5. TOKEN EXPIRY
   JWT Expires in: 7 days
   Al vencer → Frontend redirige a login
```

### Variables de Ambiente

**Frontend (`.env`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant01
VITE_APP_VERSION=0.1.0
```

**Backend (`backend/.env`)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://mongo:Pantonio2404@mongo-dev.nauvolan.abrdns.com:27017/?tls=true&tlsCAFile=/home/nauvolanl/Nextcloud/Projects/Restaurant01/backend/mongo-cert.crt&authSource=admin&tlsAllowInvalidCertificates=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Credenciales de Base de Datos

| Campo | Valor |
|-------|-------|
| **Username** | `mongo` |
| **Password** | `Pantonio2404` |
| **Host** | `mongo-dev.nauvolan.abrdns.com` |
| **Puerto** | `27017` |
| **Base de Datos** | (Por defecto en conexión) |
| **Autenticación** | TLS/SSL con certificado |
| **Archivo Cert** | `backend/mongo-cert.crt` |

⚠️ **⚠️ IMPORTANTE - SEGURIDAD:**
- Las credenciales están en `.env` (no debe commitearse)
- JWT_SECRET debe cambiar en producción
- MongoDB está en servidor remoto con SSL
- Considerar usar variables de entorno en producción

### Tokens JWT

```
Header:  {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "...",
  "email": "usuario@email.com",
  "role": "customer|staff|admin",
  "iat": 1234567890,
  "exp": 1234567890 + 7days
}

Signature: HMAC-SHA256(header + payload, JWT_SECRET)
```

### Roles y Permisos

```
CUSTOMER (cliente normal)
├── Operaciones permitidas
│   ├── Ver menú
│   ├── Agregar items a carrito
│   ├── Hacer checkout
│   ├── Ver suas órdenes
│   ├── Rastrear órdenes
│   ├── Hacer reservaciones
│   ├── Ver/editar perfil
│   └── Cambiar contraseña
└── Limitaciones
    ├── NO puede ver órdenes de otros
    ├── NO puede editar órdenes
    └── NO accede a panel admin

STAFF (personal restaurante)
├── Todo lo del CUSTOMER +
├── Operaciones adicionales
│   ├── Gestionar órdenes (ver, cambiar estado)
│   ├── Gestionar mesas
│   ├── Gestionar delivery
│   ├── Acceder a caja registradora
│   ├── Ver dashboard admin
│   └── Gestionar table bills
└── Limitaciones
    ├── NO puede gestionar clientes
    ├── NO puede gestionar inventario
    └── NO accede a reportes avanzados

ADMIN (administrador)
├── TODO ACCESO COMPLETO
├── Operaciones incluyen
│   ├── Gestionar usuarios (crear, editar, eliminar)
│   ├── Gestionar menú (crear, editar, eliminar items)
│   ├── Gestionar inventario (completo)
│   ├── Gestionar órdenes (completo)
│   ├── Gestionar mesas (completo)
│   ├── Caja registradora (completo)
│   ├── Gestionar delivery (completo)
│   ├── Ver dashboard con todas las métricas
│   ├── Gestionar table bills (completo)
│   └── Acceder a reportes y análisis
└── Sin limitaciones

GUEST (sin autenticación)
└── Limitado a
    ├── Ver menú
    ├── Agregar items a carrito (session/localStorage)
    ├── Ver carrito
    ├── Iniciar proceso de reservación
    └── Ver formulario de contacto
```

---

## 📦 Base de Datos

### Detalles de Conexión

**Tipo:** MongoDB (NoSQL)  
**Alojamiento:** Remoto (mongo-dev.nauvolan.abrdns.com)  
**Seguridad:** TLS/SSL  
**ODM:** Mongoose  

### String de Conexión
```
mongodb://mongo:Pantonio2404@mongo-dev.nauvolan.abrdns.com:27017/?tls=true&tlsCAFile=/home/nauvolanl/Nextcloud/Projects/Restaurant01/backend/mongo-cert.crt&authSource=admin&tlsAllowInvalidCertificates=true
```

### Colecciones Principales

| Colección | Propósito | Documentos aprox. |
|-----------|----------|------------------|
| **users** | Usuarios (customers, staff, admin) | 100+ |
| **menuItems** | Catálogo de platos | 50-200 |
| **orders** | Órdenes realizadas | 1000+ |
| **reservations** | Reservaciones de mesa | 500+ |
| **tables** | Mesas del restaurante | 15-30 |
| **payments** | Transacciones de pago | 1000+ |
| **inventoryItems** | Inventario | 50-100 |
| **cashRegisters** | Registro de caja | 30-50 |
| **deliveryOrders** | Órdenes en entrega | 200+ |
| **contacts** | Mensajes de contacto | 100+ |
| **eventRequests** | Solicitudes de eventos | 50+ |
| **tableBills** | Facturas de mesa | 300+ |
| **transactions** | Transacciones generales | 2000+ |

### Esquemas e Índices Recomendados

```javascript
// Users: índices para autenticación
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Orders: búsquedas frecuentes
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })

// Reservations: reservas futuras
db.reservations.createIndex({ userId: 1 })
db.reservations.createIndex({ date: 1, time: 1 })
db.reservations.createIndex({ status: 1 })

// Menu: búsquedas por categoría
db.menuItems.createIndex({ category: 1 })
db.menuItems.createIndex({ isAvailable: 1 })

// Pagos: auditoría
db.payments.createIndex({ orderId: 1 })
db.payments.createIndex({ userId: 1 })
db.payments.createIndex({ createdAt: -1 })
```

### Consideraciones de Base de Datos

⚠️ **Pendiente de Optimización:**
- [ ] Crear índices en MongoDB para mejorar queries frecuentes
- [ ] Implementar paginación en endpoints con muchos resultados
- [ ] Considerar denormalizador algunos datos para lectura
- [ ] Setup de backups automáticos
- [ ] Monitoreo de uso y crecimiento

---

## 👥 Funcionalidades por Rol

### 1. CLIENTE (CUSTOMER)

#### Autenticación
- [x] Registrarse con email y contraseña
- [x] Iniciar sesión
- [x] Cerrar sesión
- [x] Cambiar contraseña
- [x] Recuperar contraseña (parcial)

#### Menú y Carrito
- [x] Ver menú completo
- [x] Filtrar por categoría
- [x] Buscar items
- [x] Ver detalles de item (precio, ingredientes, foto)
- [x] Agregar items al carrito
- [x] Ver carrito
- [x] Modificar cantidades
- [x] Remover items del carrito
- [x] Vaciar carrito

#### Órdenes (Compras)
- [x] Realizar checkout
- [x] Seleccionar tipo de entrega (delivery, pickup, dine-in)
- [x] Ingresar dirección de entrega
- [x] Seleccionar método de pago (card, cash, transfer)
- [x] Procesar pago
- [x] Ver historial de órdenes
- [x] Ver detalle de orden
- [x] Rastrear orden en tiempo real
- [x] Cancelar orden (antes de confirmar)

#### Reservaciones
- [x] Buscar disponibilidad de mesas
- [x] Hacer reservación
- [x] Ver mis reservaciones
- [x] Editar reservación
- [x] Cancelar reservación

#### Perfil
- [x] Ver mi perfil (nombre, email, teléfono, dirección)
- [x] Editar perfil
- [x] Ver historial de pedidos
- [x] Ver historial de reservaciones
- [x] Ver puntos de lealtad

#### Otros
- [x] Enviar mensaje de contacto
- [x] Ver galería de fotos
- [x] Ver eventos especiales

### 2. PERSONAL (STAFF)

#### Autenticación
- [x] Iniciar sesión (login especial)
- [x] Cerrar sesión
- [x] Cambiar contraseña

#### Gestión de Órdenes
- [x] Ver todas las órdenes
- [x] Filtrar por estado
- [x] Ver detalle de orden
- [x] Cambiar estado (pending → confirmed → preparing → ready → delivering → delivered)
- [x] Asignar a delivery
- [x] Imprimir orden
- [x] Ver tiempo estimado

#### Gestión de Mesas
- [x] Ver estado de todas las mesas
- [x] Ver reservaciones del día
- [x] Confirmar reservaciones
- [x] Liberar mesa
- [x] Ver historial de mesa

#### Caja Registradora
- [x] Abrir caja al inicio
- [x] Ver movimientos del día
- [x] Registrar transacciones
- [x] Cierre de caja

#### Delivery
- [x] Ver órdenes en delivery
- [x] Asignar delivery
- [x] Actualizar estado de entrega
- [x] Ver ruta
- [x] Confirmar entrega

#### Dashboard
- [x] Ver resumen del día (órdenes, ventas)
- [x] Ver órdenes pendientes
- [x] Ver mesas ocupadas
- [x] Ver delivery en progreso

#### Cuentas de Mesa
- [x] Generar factura de mesa
- [x] Ver cuentas abiertas
- [x] Registrar pago
- [x] Cerrar cuenta

### 3. ADMINISTRADOR (ADMIN)

#### Autenticación
- [x] Iniciar sesión (login especial)
- [x] Cerrar sesión
- [x] Cambiar contraseña

#### Gestión de Usuarios
- [x] Ver todos los usuarios
- [x] Filtrar por rol
- [x] Ver detalles de usuario
- [x] Editar usuario
- [x] Cambiar rol de usuario
- [x] Eliminar usuario
- [x] Ver historial de usuario
- [x] Desactivar/activar usuario

#### Gestión de Menú
- [x] Ver catálogo de items
- [x] Crear nuevo item
- [x] Editar item (nombre, precio, descripción, ingredientes, foto)
- [x] Eliminar item
- [x] Cambiar disponibilidad de item
- [x] Ver categorías
- [x] Crear categoría
- [x] Editar categoría

#### Gestión de Órdenes
- [x] Ver todas las órdenes (historial completo)
- [x] Filtrar por estado, fecha, usuario
- [x] Ver detalle completo
- [x] Cambiar estado
- [x] Cancelar orden con razón
- [x] Ver informe de órdenes
- [x] Exportar datos

#### Gestión de Mesas
- [x] Ver todas las mesas
- [x] Crear nueva mesa
- [x] Editar mesa (número, capacidad, sección)
- [x] Eliminar mesa
- [x] Ver estado en tiempo real
- [x] Ver reservaciones

#### Inventario
- [x] Ver inventario completo
- [x] Agregar item a inventario
- [x] Actualizar cantidad
- [x] Registrar restock
- [x] Eliminar item
- [x] Ver historial de movimientos
- [x] Alertas de stock bajo
- [x] Recibir notificaciones de stock

#### Caja Registradora
- [x] Abrir caja
- [x] Cerrar caja
- [x] Ver todas las transacciones
- [x] Filtrar transacciones
- [x] Ver balances por período
- [x] Reportes de caja

#### Delivery
- [x] Ver todas las entregas
- [x] Asignar delivery
- [x] Cargar ubicaciones de entrega
- [x] Actualizar estado
- [x] Ver ruta de entrega
- [x] Reportes de delivery

#### Dashboard Completo
- [x] Resumen de ventas (hoy, semana, mes)
- [x] Top items vendidos
- [x] Ingresos por tipo de entrega
- [x] Métodos de pago más usados
- [x] Clientes más frecuentes
- [x] Ocupación de mesas
- [x] Efectividad de delivery
- [x] Gráficos de tendencias

#### Cuentas de Mesa
- [x] Ver todas las cuentas
- [x] Editar cuenta
- [x] Anular factura
- [x] Historial de cuentas

#### Reportes y Análisis
- [x] Reporte de ventas
- [x] Reporte de clientes
- [x] Reporte de productos más vendidos
- [x] Análisis de ingresos
- [x] Auditoría de cambios

---

## 🔄 Flujos Principales de la Aplicación

### 1️⃣ FLUJO DE COMPRA (E-commerce)

```
START
  │
  ├─→ Usuario accede a /menu
  │   └─→ Se cargan items del menú
  │
  ├─→ Usuario mira items y hace click "Agregar al Carrito"
  │   └─→ Item se agrega a CartContext (localStorage si guest)
  │
  ├─→ Usuario va a /cart
  │   └─→ Ve resumen del carrito
  │   └─→ Puede modificar cantidades o remover items
  │
  ├─→ Usuario hace click "Continuar Compra"
  │   ├─→ ¿Autenticado?
  │   │   ├─ SÍ → Va a /checkout
  │   │   └─ NO → Redirige a /login
  │   │
  │   └─→ En /checkout
  │       ├─ Selecciona tipo de entrega
  │       ├─ Ingresa dirección (si delivery)
  │       ├─ Selecciona método de pago
  │       └─ Revisa total
  │
  ├─→ Click "Pagar Ahora"
  │   └─→ POST /api/orders (crear orden)
  │       ├─ Backend valida items
  │       ├─ Calcula subtotal, impuestos, total
  │       ├─ Crea documento Order en MongoDB
  │       ├─ POST /api/payments (procesar pago)
  │       └─ Retorna orderId y token
  │
  ├─→ Orden creada exitosamente
  │   └─→ Frontend redirige a /track/{orderId}
  │
  ├─→ Usuario ve página de rastreo
  │   ├─ Estado actual de la orden
  │   ├─ Tiempo estimado
  │   ├─ Dirección de entrega
  │   ├─ Contacto del driver (si delivery)
  │   └─ Opción para cancelar
  │
  └─→ END (orden completada)
```

### 2️⃣ FLUJO DE RESERVACIÓN

```
START
  │
  ├─→ Usuario accede a /reservations
  │   └─→ Ve formulario de reservación
  │
  ├─→ Ingresa datos
  │   ├─ Fecha deseada
  │   ├─ Hora
  │   ├─ Número de personas
  │   └─ Solicitudes especiales (opcional)
  │
  ├─→ Click "Buscar Disponibilidad"
  │   └─→ GET /api/reservations/available
  │       └─ Backend consulta mesas disponibles en esa fecha/hora
  │
  ├─→ Se muestra disponibilidad
  │   └─→ Usuario selecciona horario/mesa
  │
  ├─→ ¿Autenticado?
  │   ├─ SÍ → Va directamente a confirmar
  │   └─ NO → Redirige a /login o /register
  │
  ├─→ Click "Confirmar Reservación"
  │   └─→ POST /api/reservations
  │       ├─ Backend valida disponibilidad
  │       ├─ Reserva la mesa
  │       ├─ Envía confirmación (email/SMS)
  │       └─ Retorna confirmationId
  │
  ├─→ Redirige a /booking-confirmation
  │   └─→ Muestra detalles de reservación
  │       ├─ Confirmación #
  │       ├─ Fecha y hora
  │       ├─ Mesa #
  │       ├─ Contacto de emergencia
  │       └─ Opción para editar/cancelar
  │
  └─→ END (reservación confirmada)
```

### 3️⃣ FLUJO DE AUTENTICACIÓN

```
START
  │
  ├─→ Usuario hace click "Login"
  │   └─→ Redirige a /login
  │
  ├─→ Ingresa email y contraseña
  │   │
  │   ├─→ POST /api/auth/login
  │   │   ├─ Backend busca usuario por email
  │   │   ├─ Compara password (bcryptjs)
  │   │   ├─ Si OK → Genera JWT token
  │   │   ├─ Retorna token + user data
  │   │   └─ Si FAIL → Retorna error
  │   │
  │   ├─→ Frontend verifica respuesta
  │   │   ├─ Si OK → Guarda token en localStorage
  │   │   ├─ Actualiza AuthContext
  │   │   ├─ Redirige a /
  │   │   └─ Si FAIL → Muestra error
  │   │
  │   ├─→ En cada request authenticated
  │   │   └─ Frontend envía: Authorization: Bearer {token}
  │   │
  │   └─→ Backend valida token
  │       ├─ Si válido → Procesa request
  │       └─ Si inválido → Retorna 401
  │
  ├─→ Logout
  │   ├─ Usuario hace click "Logout"
  │   ├─ Frontend elimina token de localStorage
  │   ├─ Limpia AuthContext
  │   └─ Redirige a /login
  │
  └─→ END
```

### 4️⃣ FLUJO ADMINISTRATIVO (ÓRDENES)

```
ADMIN PANEL
  │
  ├─→ Admin entra a /admin/orders
  │   └─→ GET /api/admin/orders
  │       └─ Obtiene todas las órdenes del sistema
  │
  ├─→ Ve lista de órdenes (filtros por estado, fecha)
  │   └─ Órdenes en estado: pending, confirmed, preparing, ready, etc.
  │
  ├─→ Click en orden específica
  │   └─→ Se abre modal/página con detalles:
  │       ├─ Cliente
  │       ├─ Items pedidos
  │       ├─ Total factura
  │       ├─ Dirección de entrega
  │       ├─ Estado actual
  │       ├─ Botones de acción
  │       └─ Historial de cambios
  │
  ├─→ Admin cambia estado (ej: pending → confirmed)
  │   └─→ PATCH /api/admin/orders/{id}/status
  │       ├─ Backend valida transición válida
  │       ├─ Actualiza orden en MongoDB
  │       ├─ Notifica al cliente (push/email)
  │       └─ Actualiza dashboard en vivo
  │
  ├─→ Si es delivery, admin asigna delivery driver
  │   └─→ PATCH /api/admin/orders/{id}/delivery
  │       ├─ Asigna driver
  │       ├─ Envía notificación a driver
  │       └─ Cliente ve actualizaciones en /track
  │
  ├─→ Puedo ver órdenes en tiempo real en dashboard
  │   ├─ Órdenes pendientes
  │   ├─ Órdenes que necesitan atención
  │   ├─ Delivery en progreso
  │   ├─ Órdenes completadas hoy
  │   └─ Ingresos del día
  │
  └─→ END
```

### 5️⃣ FLUJO DE INVENTARIO

```
ADMIN PANEL - Inventario
  │
  ├─→ Admin accede a /admin/inventory
  │   └─→ GET /api/admin/inventory
  │       └─ Ve listado completo de items en stock
  │
  ├─→ Ve información:
  │   ├─ Nombre del item
  │   ├─ Cantidad actual
  │   ├─ Stock mínimo
  │   ├─ Unidad de medida
  │   ├─ Última reposición
  │   └─ Alertas (si stock bajo)
  │
  ├─→ Acción 1: Reducir inventario (cuando se prepara orden)
  │   ├─ Sistema automático o manual
  │   ├─ POST /api/admin/inventory/consume
  │   └─ Reduce cantidad y registra movimiento
  │
  ├─→ Acción 2: Reponer inventario
  │   ├─ Click "Reponer"
  │   ├─ Ingresa cantidad recibida
  │   ├─ PATCH /api/admin/inventory/{id}
  │   └─ Actualiza stock y fecha de reposición
  │
  ├─→ Acción 3: Agregar nuevo item
  │   ├─ Click "Agregar Item"
  │   ├─ Ingresa: nombre, cantidad inicial, unidad, stock mínimo
  │   ├─ POST /api/admin/inventory
  │   └─ Crea nuevo item en inventario
  │
  ├─→ Reportes
  │   ├─ Historial de movimientos
  │   ├─ Items que necesitan reposición
  │   ├─ Uso por período
  │   └─ Costo de inventario
  │
  └─→ END
```

---

## ✅ Funcionalidades Completadas

### MVP Core Features
- [x] Autenticación JWT (login/register/logout)
- [x] Roles y permisos (customer, staff, admin)
- [x] Catálogo de menú dinámico
- [x] Carrito de compras (guest + autenticado)
- [x] Checkout y pago
- [x] Gestión de órdenes
- [x] Reservaciones de mesa
- [x] Panel administrativo

### Frontend Features
- [x] Responsive design (mobile-first)
- [x] Dark/Light mode
- [x] Componentes UI polished
- [x] Validación de formularios
- [x] Manejo de errores
- [x] Loading states
- [x] Context API para state management
- [x] Local storage para persistencia
- [x] Modal system
- [x] Toast notifications

### Backend Features
- [x] JWT authentication
- [x] CORS configurado
- [x] Helmet (seguridad HTTP)
- [x] Input validation
- [x] Error handling
- [x] Rate limiting
- [x] MongoDB integration
- [x] Swagger/OpenAPI docs
- [x] Request logging

### Database
- [x] MongoDB schemas bien definidos
- [x] Relaciones entre colecciones
- [x] Timestamps en documentos
- [x] Índices básicos

---

## ❌ Funcionalidades Pendientes / Mejoras

### Críticas (Para Producción)
- [ ] **Email notifications** - Sistema de notificaciones por email (confirmaciones, estado órdenes)
- [ ] **SMS notifications** - Notificaciones por SMS
- [ ] **2FA** - Autenticación de dos factores
- [ ] **Password reset** - Recuperación de contraseña completa
- [ ] **Logging y monitoring** - Logs centralizados y monitoreo
- [ ] **Testing automado** - Unit tests, integration tests
- [ ] **CI/CD pipeline** - Automatización de deploy
- [ ] **Rate limiting** - Límites más estrictos
- [ ] **Auditoría** - Registro de cambios críticos

### Importante (Para Escalabilidad)
- [ ] **Caching** - Redis para caché (menú, órdenes frecuentes)
- [ ] **Real-time updates** - WebSockets o Server-Sent Events
- [ ] **Push notifications** - Notificaciones push en navegador
- [ ] **Búsqueda avanzada** - Elasticsearch para búsquedas
- [ ] **Paginación** - Implementar en todos los endpoints
- [ ] **API pagination** - Límite de resultados
- [ ] **Búsqueda de órdenes** - Por fecha, cliente, estado
- [ ] **Reportes avanzados** - PDF, Excel export
- [ ] **Analytics** - Google Analytics, Mixpanel
- [ ] **Backup automático** - MongoDB backups

### De Producto
- [ ] **Cupones/Descuentos** - Sistema de codes de descuento
- [ ] **Programa de lealtad** - Puntos, niveles VIP
- [ ] **Reseñas y ratings** - Clientes califiquen órdenes
- [ ] **Favoritos** - Guardar platos favoritos
- [ ] **Recomendaciones** - Sistema de recomendación por IA
- [ ] **Preguntas frecuentes** - FAQ section
- [ ] **Chat de soporte** - Live chat
- [ ] **Sistema de reff

errals** - Referir amigos
- [ ] **Integración de redes sociales** - Share en redes
- [ ] **Multi-idioma** - i18n implementation

### Técnicas
- [ ] **Tests** - Unit y integration tests
- [ ] **Type safety** - Strict mode en TypeScript
- [ ] **Error boundaries** - React error boundaries
- [ ] **Performance** - Lazy loading, code splitting, image optimization
- [ ] **SEO** - Meta tags, sitemap, robots.txt
- [ ] **Accessibility** - WCAG 2.1 AA compliance
- [ ] **API documentation** - Swagger actualizado
- [ ] **Database indexing** -  Análisis y optimización
- [ ] **Load testing** - Pruebas bajo carga
- [ ] **Security audit** - Penetration testing

### De DevOps
- [ ] **Docker** - Containerización
- [ ] **Docker Compose** - Para desarrollo
- [ ] **Environment management** - Dev, staging, prod
- [ ] **Database migrations** - Sistema de migraciones
- [ ] **Health checks** - Endpoints de salud
- [ ] **Rollback strategy** - Plan de rollback
- [ ] **SSL/TLS** - Certificados en producción
- [ ] **Cloud deployment** - AWS, GCP, Azure
- [ ] **CDN** - Para assets estáticos

---

## ⚠️ Consideraciones Importantes

### 🔒 Seguridad

1. **JWT Secret** - Debe cambiar en producción
2. **Credenciales** - No dejarcredenciales en el código
3. **CORS** - Configurado para `localhost:3000`, cambiar en producción
4. **Validación** - Todos los inputs deben validarse en backend
5. **SQL/NoSQL Injection** - Mongoose se protege automáticamente
6. **XSS** - React escapa por defecto
7. **CSRF** - Implementar si es necesario
8. **Rate limiting** - Considerar aumentar restricciones
9. **HTTPS** - Obligatorio en producción
10. **Certificado MongoDB** - Actualizar ruta en producción

### 📊 Performance

1. **Índices MongoDB** - Crear según queries más frecuentes
2. **Paginación** - Falta en muchos endpoints
3. **Lazy loading** - Frontend podría mejorar
4. **Caching** - Sin implementar actualmente
5. **Compresión** - Gzip en backend
6. **Images** - Optimizar tamaño y formato
7. **Bundling** - Vite está configurado correctamente
8. **Database size** - Monitorear crecimiento

### 🐛 Testing

1. **Test coverage** - Bajo actualmente
2. **Unit tests** - Pocos componentes/funciones testeados
3. **Integration tests** - Necesarios para flujos críticos
4. **E2E tests** - Falta automatización
5. **Performance tests** - No realizados

### 📦 Deployment

1. **Versioning** - Considerar semantic versioning (0.1.0 es muy beta)
2. **Changelog** - Mantener bien actualizado
3. **Documentation** - Esta guía necesita completarse
4. **Runbooks** - Crear guías de operación
5. **Disaster recovery** - Plan de recuperación ante fallos

### 🔄 Mantenibilidad

1. **Code organization** - Bien estructurado
2. **Naming conventions** - Consistente
3. **Comments** - Podría haber más
4. **Type definitions** - Buena cobertura
5. **Error messages** - En español, bien
6. **Logging** - Limitado en backend

---

## 🚀 Guía de Inicio

### Requisitos Previos
```bash
- Node.js 16+ 
- npm o pnpm
- MongoDB (remota ya está configurada)
- Git
```

### Instalación Rápida

#### Opción 1: Script Automático (Recomendado)
```bash
cd c:\Users\pagar\Nextcloud\Projects\Restaurant01
chmod +x start.sh
./start.sh
```

#### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
pnpm install
pnpm start  # O: NODE_ENV=development pnpm dev
```

**Terminal 2 - Frontend:**
```bash
pnpm install
pnpm dev
```

### Acceso Inicial

```
Frontend:      http://localhost:3000
Backend API:   http://localhost:5000/api
API Docs:      http://localhost:5000/api/docs
Health Check:  http://localhost:5000/api/health
```

### Credenciales de Prueba (si existen seeds)

```
Nombre:     Test Admin
Email:      admin@test.com
Password:   (revisar seed en backend/src/seeds)
Rol:        admin

Nombre:     Test Customer
Email:      customer@test.com
Password:   (revisar seed)
Rol:        customer
```

*Nota:* Revisar si hay seed data ejecutando:
```bash
cd backend
pnpm run seed
```

### Comandos Útiles

**Frontend:**
```bash
pnpm dev           # Desarrollo
pnpm build         # Build para producción
pnpm test          # Ejecutar tests
pnpm test:watch    # Watch mode tests
pnpm test:coverage # Cobertura
```

**Backend:**
```bash
pnpm dev           # Desarrollo con nodemon
pnpm build         # Compilar TypeScript
pnpm start         # Ejecutar compilado
pnpm test          # Tests
pnpm test:watch    # Watch mode
pnpm seed          # Seed inicial de datos
```

### Estructura de Carpetas Importante

```
Restaurant01/
├── src/                    # Frontend source
├── backend/                # Backend source (compilado en dist/)
├── build/                  # Frontend compilado
├── public/                 # Assets estáticos
├── coverage/               # Reports de test coverage
├── package.json            # Frontend dependencies
├── backend/package.json    # Backend dependencies
├── .env                    # Variables de entorno (NO commitar)
├── .env.example            # Template de .env
├── vite.config.ts          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── tsconfig.json           # Configuración TypeScript
```

### Configuración Inicial

1. **Crear `.env` en raíz:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant01
VITE_APP_VERSION=0.1.0
```

2. **Verificar `backend/.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:Pantonio2404@mongo-dev.nauvolan.abrdns.com:27017/?tls=true&tlsCAFile=/home/nauvolanl/Nextcloud/Projects/Restaurant01/backend/mongo-cert.crt&authSource=admin&tlsAllowInvalidCertificates=true
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

3. **Instalar dependencias:**
```bash
pnpm install          # Frontend
cd backend && pnpm install  # Backend
```

4. **Iniciar:**
```bash
./start.sh  # O manualmente en dos terminales como se indicó arriba
```

---

## 📅 Checklist para Product Manager

### Entendimiento del Proyecto
- [x] Identificar stack tecnológico
- [x] Entender arquitectura (frontend + backend + DB)
- [x] Revisar roles y permisos
- [x] Entender flujos principales

### Operación Inicial
- [ ] Ejecutar proyecto localmente y validar que funcione
- [ ] Crear credenciales de prueba (admin, customer, staff)
- [ ] Probar flujos principales (login, compra, reservación)
- [ ] Revisar Swagger docs en `/api/docs`
- [ ] Validar que MongoDB está conectado

### Priorización
- [ ] Identificar qué está roto o falta
- [ ] Priorizar funcionalidades críticas vs. nice-to-have
- [ ] Estimar effort para cada feature
- [ ] Crear roadmap de producto

### Antes de Producción
- [ ] Cambiar JWT_SECRET
- [ ] Configurar logging y monitoreo
- [ ] Implementar al menos tests básicos
- [ ] Crear plan de backup
- [ ] Revisar seguridad (OWASP)
- [ ] Load testing
- [ ] Runbooks y documentación operacional

---

**Documento completo del estado del proyecto Restaurant01**  
Última actualización: 4 de Abril, 2026
