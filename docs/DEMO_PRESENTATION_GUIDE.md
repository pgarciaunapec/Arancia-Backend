# 🎯 GUÍA DE PRESENTACIÓN DEMO - ARANCIA

**Proyecto:** Sistema Integral de Gestión de Restaurante  
**Estado:** MVP Completado y Funcional ✅  
**Fecha Demo:** 14 de Abril, 2026  

---

## 📑 Índice Rápido de Módulos

Para presentadores: esta guía muestra **qué es**, **dónde está**, **cómo funciona** y **qué hace el usuario** en cada módulo.

| Módulo | Descripción Rápida | Página/Vista | Acceso |
|--------|-------------------|-------------|--------|
| **Autenticación** | Login/Registro | `/login`, `/register` | Público |
| **Inicio** | Landing page + Info restaurante | `/` | Público |
| **Menú** | Ver productos, búsqueda, categorías | `/menu` | Público |
| **Carrito** | Carrito de compras | `/cart` | Público/Autenticado |
| **Checkout** | Pagar pedido | `/checkout` | Autenticado |
| **Órdenes** | Ver mis pedidos + rastreo | `/my-orders`, `/order-tracking/:id` | Autenticado |
| **Reservas** | Reservar mesa | `/reservations` | Autenticado |
| **Mis Reservas** | Historial de reservas | `/my-reservations` | Autenticado |
| **Perfil** | Info usuario, editar datos | `/profile` | Autenticado |
| **Panel Admin** | Dashboard administrativo | `/admin/*` | Admin |
| **Contacto** | Formulario contacto | `/contact` | Público |
| **Galería** | Fotos del restaurante | `/gallery` | Público |
| **Eventos** | Eventos especiales | `/events` | Público |

---

## 🏗️ ARQUITECTURA GENERAL DEL PROYECTO

```
ARANCIA - SISTEMA DE RESTAURANTE
│
├── 🎨 FRONTEND (React + Vite)
│   ├── Públicas: Login, Menu, Reservas, Galería, Contacto
│   ├── Autenticadas: Carrito, Checkout, Órdenes, Perfil
│   └── Admin: Dashboard con 10+ subsistemas
│
├── 🔗 REST API (Express + TypeScript)
│   ├── 12 módulos de rutas
│   ├── Autenticación JWT
│   ├── Swagger Doc en /api/docs
│   └── Base datos MongoDB
│
└── 💾 DATABASE (MongoDB Atlas)
    ├── 20+ colecciones
    ├── Relaciones entre modelos
    └── Índices para rendimiento
```

---

## 🎬 FLUJO GENERAL DE UN USUARIO

### **Caso 1: Cliente que Compra (Delivery o Comer)**

```
1. Llega a Home (/inicio)
   ↓
2. Ve menú, busca productos (/menu)
   ↓
3. Agrega a carrito (/cart)
   ↓
4. Decide si:
   a) Compra SIN cuenta → Checkout directo (/checkout)
   b) Se registra/login → Checkout (/checkout)
   ↓
5. Elige método de pago → Procesamiento
   ↓
6. Ve confirmación + rastreo (/order-tracking/:id)
   ↓
7. Si registrado: Ve historial en /my-orders
```

### **Caso 2: Cliente que Reserva Mesa**

```
1. Navega a /reservations
   ↓
2. Selecciona fecha, hora, cantidad personas
   ↓
3. Sistema verifica disponibilidad de mesas
   ↓
4. Completa datos de contacto
   ↓
5. Genera confirmación (/booking-confirmation)
   ↓
6. Si autenticado: Ver en /my-reservations
```

### **Caso 3: Administrador**

```
1. Accede a /admin/login (credenciales especiales)
   ↓
2. Entra a panel (/admin/dashboard)
   ↓
3. Puede:
   - Ver métricas en tiempo real
   - Gestionar órdenes
   - Gestionar mesas y reservas
   - Controlar inventario
   - Usar caja registradora
   - Rastrear deliveries
   - Ver auditoría de cambios
   - Importar/exportar datos
```

---

## 📋 MÓDULOS DOCUMENTADOS

Cada módulo tiene su propia documentación detallada:

### **Módulo 1: [Autenticación y Gestión de Usuarios](./MODULES/01-AUTHENTICATION.md)**
- Registro, Login, Cambio de contraseña
- Perfil de usuario
- JWT y seguridad

### **Módulo 2: [Menú de Productos](./MODULES/02-MENU.md)**
- Catálogo de productos
- Categorías
- Búsqueda y filtros
- Admin: Crear/Editar productos

### **Módulo 3: [Carrito y Checkout](./MODULES/03-CART-CHECKOUT.md)**
- Carrito persistente
- Cálculo de totales
- Métodos de envío
- Formulario de checkout

### **Módulo 4: [Órdenes y Rastreo](./MODULES/04-ORDERS.md)**
- Crear órdenes
- Estados de órdenes
- Rastreo en tiempo real
- Historial de compras

### **Módulo 5: [Reservas de Mesa](./MODULES/05-RESERVATIONS.md)**
- Disponibilidad de mesas
- Crear reserva
- Confirmación
- Historial

### **Módulo 6: [Pagos](./MODULES/06-PAYMENTS.md)**
- Procesamiento de pagos
- Métodos de pago
- Invoices y facturas
- Historial de transacciones

### **Módulo 7: [Delivery y Rastreo](./MODULES/07-DELIVERY.md)**
- Control de entregas
- Asignación de repartidores
- GPS tracking
- Estados de envío

### **Módulo 8: [Panel Administrativo](./MODULES/08-ADMIN.md)**
- Dashboard
- Gestión de usuarios
- Gestión de mesas
- Control de inventario
- Caja registradora
- Reportes y auditoría

### **Módulo 9: [Contacto y Notificaciones](./MODULES/09-CONTACT-NOTIFICATIONS.md)**
- Formulario de contacto
- Sistema de notificaciones
- Emails automáticos

### **Módulo 10: [Contenido Estático](./MODULES/10-CONTENT.md)**
- Galería de fotos
- Página de eventos
- Servicios
- Página de información

---

## 🔑 CREDENCIALES DE PRUEBA

### Cliente Regular
- **Email:** cliente@prueba.com
- **Contraseña:** Prueba123!

### Administrador
- **Email:** admin@prueba.com
- **Contraseña:** Admin123!

---

## 🌐 ACCESO A SERVICIOS

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:5000 | 5000 |
| **Swagger Docs** | http://localhost:5000/api/docs | 5000 |
| **Health Check** | http://localhost:5000/api/health | 5000 |

---

## ✅ FUNCIONALIDADES PRINCIPALES IMPLEMENTADAS

### ✨ Cliente
- [x] Autenticación segura (JWT)
- [x] Visualización de menú
- [x] Carrito de compras persistente
- [x] Checkout con múltiples enfoques
- [x] Rastreo de orden en tiempo real
- [x] Reservas de mesa
- [x] Historial de pedidos
- [x] Perfil personalizable
- [x] Notificaciones

### 🎛️ Administración
- [x] Dashboard con métricas
- [x] CRUD de productos
- [x] Gestión de órdenes (estados, asignación)
- [x] Gestión de mesas y reservas
- [x] Control de inventario
- [x] Caja registradora digital
- [x] Asignación de delivery
- [x] Reportes y análisis
- [x] Auditoría de cambios
- [x] Importar/exportar datos

---

## 🚀 PUNTOS CLAVE PARA LA DEMO

### **Información Técnica (NO mencionar en demo casual)**
- Stack: React 18 + Express + MongoDB
- Autenticación: JWT Tokens
- Hosting: Docker containers
- Base de datos: MongoDB Atlas con SSL
- API: RESTful con Swagger docs

### **Información de Negocios (SÍ mencionar)**
- ✅ Cliente puede comprar SIN crear cuenta
- ✅ Sistema automático de facturación
- ✅ Rastreo de órdenes en tiempo real
- ✅ Reservas dinámicas de mesas
- ✅ Control completo de inventario
- ✅ Múltiples métodos de pago
- ✅ Dashboard con KPIs importantes
- ✅ Auditoría completa de operaciones

---

## 📱 VISTAS CLAVE PARA DEMOSTRAR

### En el Navegador (Frontend - Cliente)
1. **Home** - Primera impresión, diseño moderno
2. **Menu** - Productos, búsqueda, categorías
3. **Cart** - Agregar/remover, mostrar total
4. **Checkout** - Flujo de compra
5. **Order Tracking** - Ver estado del pedido
6. **My Orders** - Historial personal

### En el Navegador (Frontend - Admin)
1. **Admin Dashboard** - Visión general de métricas
2. **Admin Orders** - Gestión de pedidos
3. **Admin Tables** - Control de mesas
4. **Admin Inventory** - Stock de productos

### En Swagger (Backend)
1. Mostrar documentación de API
2. Ejecutar endpoints de ejemplo
3. Explicar autenticación JWT

---

## 💡 ESTRUCTURA DE DOCUMENTACIÓN

```
/docs/
├── DEMO_PRESENTATION_GUIDE.md (este archivo)
└── MODULES/
    ├── 01-AUTHENTICATION.md
    ├── 02-MENU.md
    ├── 03-CART-CHECKOUT.md
    ├── 04-ORDERS.md
    ├── 05-RESERVATIONS.md
    ├── 06-PAYMENTS.md
    ├── 07-DELIVERY.md
    ├── 08-ADMIN.md
    ├── 09-CONTACT-NOTIFICATIONS.md
    └── 10-CONTENT.md
```

**Lee cada módulo según lo que vayas a demostrar.**

---

## 🎙️ CONSEJOS PARA PRESENTADORES

1. **Conoce el flujo:** Practica el flow completo del cliente antes de presentar
2. **Ten contexto:** Lee el módulo que vas a demostrar
3. **Menciona URLs:** Ayuda a recordar dónde están las cosas
4. **Muestra lo visual:** El frontend es lo que impacta primero
5. **Explica sin tecnicismos:** Di "pedido" no "documento en colección"
6. **Ten credenciales listas:** Admin, cliente, etc.
7. **Prepara datos de prueba:** Órdenes, reservas, etc.

---

## 📞 ¿DUDAS?

Si un presentador no encuentra algo:
1. Busca el módulo en la tabla de índice
2. Lee la sección de "URLs" del módulo
3. Consulta la guía de "Flujo de Usuario"

**¡A presentar! 🚀**
