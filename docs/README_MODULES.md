# 📚 ÍNDICE MAESTRO DE DOCUMENTACIÓN - ARANCIA

**Documentación completa para presentadores - Proyecto Arancia**

---

## 🎯 ¿POR DÓNDE EMPEZAR?

**Si es tu primera vez:**
1. Lee: [DEMO_PRESENTATION_GUIDE.md](./DEMO_PRESENTATION_GUIDE.md) (5 min)
2. Elige módulo: [Índice de módulos](#-módulos-disponibles)
3. Lee el módulo específico (10-15 min)
4. Practica en el navegador
5. ¡Presenta con seguridad!

---

## 🎓 DOCUMENTOS PRINCIPALES

### Documentación General
- **[DEMO_PRESENTATION_GUIDE.md](./DEMO_PRESENTATION_GUIDE.md)** - Guía de inicio rápido para presentadores
  - Qué es Arancia
  - Flujos de usuarios
  - URLs principales
  - Credenciales de prueba
  - Puntos clave para la demo

---

## 📦 MÓDULOS DISPONIBLES

### 1️⃣ Autenticación y Gestión de Usuarios
📄 [MODULES/01-AUTHENTICATION.md](./MODULES/01-AUTHENTICATION.md)

**Importante para:** Entender cómo acceden los usuarios

**Cubre:**
- Registro e login
- Cambio de contraseña
- Datos de perfil
- Seguridad JWT

**URLs Clave:**
- Frontend: `/login`, `/register`, `/profile`
- Backend: `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`

---

### 2️⃣ Menú de Productos
📄 [MODULES/02-MENU.md](./MODULES/02-MENU.md)

**Importante para:** Mostrar catálogo de productos

**Cubre:**
- Visualizar menú completo
- Búsqueda de productos
- Filtros por categoría
- Edición de productos (admin)

**URLs Clave:**
- Frontend: `/menu`
- Backend: `GET /menu`, `GET /menu/search/:query`, `POST /menu` (admin)

---

### 3️⃣ Carrito y Checkout
📄 [MODULES/03-CART-CHECKOUT.md](./MODULES/03-CART-CHECKOUT.md)

**Importante para:** Demostrar proceso de compra

**Cubre:**
- Agregar productos al carrito
- Modificar cantidades
- Métodos de envío (delivery, pickup, express)
- Métodos de pago
- Cálculo de totales y impuestos

**URLs Clave:**
- Frontend: `/cart`, `/checkout`
- Backend: `POST /orders`, `GET /payments`

---

### 4️⃣ Órdenes y Rastreo
📄 [MODULES/04-ORDERS.md](./MODULES/04-ORDERS.md)

**Importante para:** Mostrar gestión de pedidos

**Cubre:**
- Crear órdenes
- Ver mis órdenes
- Rastreo en tiempo real
- Estados de órdenes
- Admin gestiona todas las órdenes

**URLs Clave:**
- Frontend: `/my-orders`, `/order-tracking/:id`
- Backend: `POST /orders`, `GET /orders`, `PUT /admin/orders/:id/status`

**Estados de Orden:**
`pending` → `confirmed` → `preparing` → `ready` → `in_delivery` → `delivered`

---

### 5️⃣ Reservas de Mesa
📄 [MODULES/05-RESERVATIONS.md](./MODULES/05-RESERVATIONS.md)

**Importante para:** Demostrar sistema de reservaciones

**Cubre:**
- Buscar disponibilidad de mesas
- Crear reservación
- Ver confirmación
- Mis reservaciones
- Editar/cancelar
- Admin gestiona mesas

**URLs Clave:**
- Frontend: `/reservations`, `/my-reservations`, `/booking-confirmation`
- Backend: `POST /reservations`, `GET /reservations/availability`

---

### 6️⃣ Pagos y Facturación
📄 [MODULES/06-PAYMENTS.md](./MODULES/06-PAYMENTS.md)

**Importante para:** Entender procesamiento de pagos

**Cubre:**
- Métodos de pago (tarjeta, PayPal, efectivo, transfer)
- Procesamiento seguro (Stripe)
- Generación de facturas PDF
- Historial de transacciones
- Reembolsos

**URLs Clave:**
- Backend: `POST /payments/process`, `GET /invoices/:orderId`

**Tarjetas de Prueba:**
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- (Estamos en test mode - NO se cobra)

---

### 7️⃣ Delivery y Rastreo
📄 [MODULES/07-DELIVERY.md](./MODULES/07-DELIVERY.md)

**Importante para:** Mostrar rastreo de entregas

**Cubre:**
- Rastreo de orden en mapa (GPS)
- Información del repartidor
- Ubicación en tiempo real
- Admin asigna repartidor
- Estados de entrega

**URLs Clave:**
- Frontend: `/order-tracking/:id` (con mapa)
- Backend: `PUT /admin/orders/:id/assign-courier`

---

### 8️⃣ Panel Administrativo
📄 [MODULES/08-ADMIN.md](./MODULES/08-ADMIN.md)

**Importante para:** Centro de control del negocio

**Cubre:**
- Dashboard con KPIs
- Gestión de órdenes
- CRUD de productos
- Gestión de mesas
- Control de inventario
- Caja registradora
- Gestión de delivery
- Reportes y analytics
- Auditoría de cambios

**URLs Clave:**
- Frontend: `/admin/login`, `/admin/dashboard`, `/admin/orders`, `/admin/collections`, etc.
- Backend: `GET /admin/*`

**Credenciales Admin:**
- Email: `admin@prueba.com`
- Contraseña: `Admin123!`
- URL especial: `/admin/login` (no `/login`)

---

### 9️⃣ Contacto y Notificaciones
📄 [MODULES/09-CONTACT-NOTIFICATIONS.md](./MODULES/09-CONTACT-NOTIFICATIONS.md)

**Importante para:** Sistema de comunicación

**Cubre:**
- Formulario de contacto
- Notificaciones automáticas
- Preferencias de notificación
- Emails y SMS
- Respuestas de admin

**URLs Clave:**
- Frontend: `/contact`, `/profile` (preferences)
- Backend: `POST /contact`, `GET /notifications`

---

### 🔟 Contenido Estático
📄 [MODULES/10-CONTENT.md](./MODULES/10-CONTENT.md)

**Importante para:** Presentar el restaurante

**Cubre:**
- Home/Landing
- Página About
- Servicios
- Galería de fotos
- Eventos especiales
- Políticas y términos

**URLs Clave:**
- Frontend: `/`, `/about`, `/services`, `/gallery`, `/events`, `/terms`

---

## 🎯 GUÍAS RÁPIDAS POR ESCENARIO

### 📋 Escenario: "Quiero demostrar cómo compra un cliente"
**Lectura recomendada (orden):**
1. [MODULES/02-MENU.md](./MODULES/02-MENU.md) - Ver menú
2. [MODULES/03-CART-CHECKOUT.md](./MODULES/03-CART-CHECKOUT.md) - Compra
3. [MODULES/04-ORDERS.md](./MODULES/04-ORDERS.md) - Ver orden
4. [MODULES/07-DELIVERY.md](./MODULES/07-DELIVERY.md) - Rastrear delivery

**Tiempo demo:** 10 minutos

---

### 📋 Escenario: "Quiero demostrar cómo se reserva una mesa"
**Lectura recomendada:**
1. [MODULES/05-RESERVATIONS.md](./MODULES/05-RESERVATIONS.md) - Todo el módulo

**Tiempo demo:** 5 minutos

---

### 📋 Escenario: "Quiero demostrar panel de admin"
**Lectura recomendada:**
1. [MODULES/08-ADMIN.md](./MODULES/08-ADMIN.md) - Todo el módulo
2. Subsistema que vayas a mostrar (órdenes, productos, etc.)

**Tiempo demo:** 15 minutos

---

### 📋 Escenario: "Demo completa de todo"
**Lectura recomendada (orden):**
1. [DEMO_PRESENTATION_GUIDE.md](./DEMO_PRESENTATION_GUIDE.md)
2. [MODULES/01-AUTHENTICATION.md](./MODULES/01-AUTHENTICATION.md) - Login
3. [MODULES/10-CONTENT.md](./MODULES/10-CONTENT.md) - Home
4. [MODULES/02-MENU.md](./MODULES/02-MENU.md) - Menú
5. [MODULES/03-CART-CHECKOUT.md](./MODULES/03-CART-CHECKOUT.md) - Compra
6. [MODULES/04-ORDERS.md](./MODULES/04-ORDERS.md) - Rastreo
7. [MODULES/05-RESERVATIONS.md](./MODULES/05-RESERVATIONS.md) - Reserva
8. [MODULES/08-ADMIN.md](./MODULES/08-ADMIN.md) - Admin panel

**Tiempo demo:** 45-60 minutos

---

## 🌐 ACCESO A SERVICIOS

| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|-----------|
| **Frontend - Cliente** | http://localhost:3000 | cliente@prueba.com | Prueba123! |
| **Frontend - Admin** | http://localhost:3000/admin | admin@prueba.com | Admin123! |
| **Backend - API** | http://localhost:5000 | - | - |
| **Backend - Swagger** | http://localhost:5000/api/docs | - | - |
| **Backend - Health** | http://localhost:5000/api/health | - | - |

---

## 🔑 CREDENCIALES DE PRUEBA

### Cliente Regular
```
Email: cliente@prueba.com
Contraseña: Prueba123!
```

### Administrador
```
Email: admin@prueba.com
Contraseña: Admin123!
Login en: http://localhost:3000/admin/login (NO /login)
```

### Tarjetas de Prueba (Stripe - Test Mode)
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Expiry: 12/25
CVC: 123
⚠️ NO se cobra dinero real - Estamos en test mode
```

---

## 📱 RESPONSIVE DESIGN

✅ Todas las vistas son responsive
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Móvil (< 768px)

**Para revisar en móvil:** Press F12 → Toggle device toolbar

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- React 18.3.1
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Router (navegación)

### Backend
- Express.js + Node.js
- TypeScript
- MongoDB (Atlas - remoto)
- JWT (autenticación)
- Swagger (docs API)

### Base de Datos
- MongoDB Atlas (remoto, con SSL)
- 20+ colecciones
- Índices para rendimiento

---

## ❓ PREGUNTAS COMUNES EN DEMO

**P: ¿Necesito internet?**
A: Sí, la base de datos está en MongoDB Atlas (remoto).

**P: ¿Se cobrará dinero?**
A: NO, todas las transacciones están en test mode.

**P: ¿Cómo borro datos de prueba?**
A: Los datos de demo se pueden llenar de nuevo ejecutando seeds (scripts).

**P: ¿Puedo hacer cambios?**
A: Sí, como admin puedes crear/editar productos, órdenes, etc.

**P: ¿Dónde están las vistas?**
A: Frontend: `/src/pages/` | Admin: `/src/pages/admin/`

**P: ¿Documentación de API?**
A: En Swagger: http://localhost:5000/api/docs

---

## 📞 CONTACTO Y SOPORTE

Si tienes dudas sobre la documentación:
1. Revisa el módulo específico
2. Busca "Q:" en el módulo para preguntas comunes
3. Checkea la sección de "Errores comunes"

---

## ✅ CHECKLIST ANTES DE PRESENTAR

- [ ] He leído DEMO_PRESENTATION_GUIDE.md
- [ ] He identificado qué módulos voy a presentar
- [ ] He leído los módulos específicos
- [ ] He practicado los flujos en el navegador
- [ ] Tengo las credenciales listas
- [ ] Sé dónde están las URLs principales
- [ ] He revisado escenarios de error
- [ ] Entiendo el flujo completo de un cliente
- [ ] Entiendo el panel admin
- [ ] Estoy listo para presentar 🚀

---

## 📚 ESTRUCTURA DE CARPETAS

```
/docs/
├── DEMO_PRESENTATION_GUIDE.md (este archivo)
├── README_MODULES.md (este índice)
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

---

## 🎉 ¡LISTO PARA PRESENTAR!

Ahora que tienes toda la documentación:

1. **Elige tu escenario** (consulta guías rápidas arriba)
2. **Lee los módulos** necesarios
3. **Practica en navegador** con URLs y datos
4. **Presenta con confianza** conociendo cada flujo
5. **Responde preguntas** consultando los módulos

**¡A presentar! 🚀**

---

*Última actualización: 14 de Abril, 2026*  
*Documentación para presentadores del proyecto Arancia*
