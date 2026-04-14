# 📦 MÓDULO 4: ÓRDENES Y RASTREO

**Para qué sirve:** Crear, gestionar y rastrear pedidos una vez que se completó el checkout.

---

## 📋 FLUJO DE USUARIO

### 📝 Crear una Orden

```
(Ver Módulo 3: Checkout)

Usuario completa checkout
↓
Sistema procesa pago
↓
Crea Orden en MongoDB:
  - Estado: "pending"
  - Items: producto, cantidad, precio
  - Cliente: nombre, email, teléfono
  - Envío: dirección, método
  - Total: monto pagado
↓
Sistema genera Número de Confirmación
↓
Envía email de confirmación
↓
Redirige a /booking-confirmation (con número orden)
```

### 👀 Ver Mis Órdenes

```
1. Usuario autenticado navega a http://localhost:3000/my-orders
2. Ve lista de todas sus órdenes:
   - Número de orden
   - Fecha
   - Productos (resumen)
   - Total pagado
   - Estado ACTUAL (pending, confirmed, preparing, ready, shipped, etc.)
   - Botón para ver detalles / rastrear
3. Puede filtrar por:
   - Estado (pendientes, completadas, etc.)
   - Fecha (hoy, última semana, etc.)
   - Tipo (delivery, pickup)
```

### 🗺️ Rastrear Orden

```
1. Usuario hace clic en orden de /my-orders
2. Navega a http://localhost:3000/order-tracking/:orderId
3. Ve:
   - Resumen del pedido
   - Línea de tiempo del estado:
     * ✅ Pedido confirmado (tiempo)
     * ⏳ Preparando (tiempo estimado)
     * 🚗 En camino (ubicación en mapa si delivery)
     * ✅ Entregado
   - Información de repartidor (si en camino)
   - Teléfono del repartidor
   - Botón de contacto / chat
   - Ubicación GPS (si disponible)
```

### 🎯 Estados de Orden

```
pending          → Orden recibida, esperando confirmación admin
confirmed        → Admin confirmó, pasará a cocina
preparing        → En preparación en cocina
ready            → Listo para entregar/recoger
in_delivery      → Salió para entrega (con repartidor)
delivered        → Entregada al cliente
cancelled        → Orden cancelada
completed        → Orden finalizada (feedback recibido)
```

### 🛠️ Admin Gestiona Órdenes

```
1. Admin accede a http://localhost:3000/admin/orders
2. Ve tabla con TODAS las órdenes:
   - ID
   - Cliente
   - Estado
   - Total
   - Hora de creación
3. Puede:
   - Ver detalles (haciendo clic)
   - Cambiar estado (confirmar, enviar a cocina, etc.)
   - Asignar a repartidor (si delivery)
   - Ver notas del cliente
   - Imprimir etiqueta
   - Marcar como completada
4. Filtros:
   - Por estado
   - Por hoy/semana/mes
   - Por cliente
   - Por tipo (delivery/pickup)
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Mis Órdenes** | `/my-orders` | Historial de pedidos |
| **Rastreo Orden** | `/order-tracking/:id` | Seguimiento en tiempo real |
| **Confirmación** | `/booking-confirmation` | Confirmación post-compra |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Órdenes** | `/admin/orders` | Gestión todas las órdenes |
| **Detalles Orden** | `/admin/orders/:id` | Ver y editar orden |

---

## 🔗 ENDPOINTS DEL BACKEND

### Cliente (Órdenes propias)

```
POST /orders
- Auth: JWT (opcional)
- Body: { items, customerInfo, shippingMethod, paymentMethod, totalAmount }
- Response: { orderId, confirmationNumber, status }
- Estado: ✅ Implementado

GET /orders
- Auth: JWT (obligatorio)
- Response: [ órdenes del usuario ]
- Query: estado, fecha, tipo
- Estado: ✅ Implementado

GET /orders/:id
- Auth: JWT (opcional)
- Response: { orden completa con detalles }
- Estado: ✅ Implementado

PUT /orders/:id/cancel
- Auth: JWT
- Response: { message, order }
- Cancela: solo si no estádish, preparing, etc.
- Estado: ✅ Implementado
```

### Admin (Todas las órdenes)

```
GET /admin/orders
- Auth: JWT + Admin
- Query: estado, fecha, skip, limit
- Response: [ todas las órdenes ]
- Estado: ✅ Implementado

GET /admin/orders/:id
- Auth: JWT + Admin
- Response: { orden con referencias expandidas }
- Estado: ✅ Implementado

PUT /admin/orders/:id/status
- Auth: JWT + Admin
- Body: { status: "preparing" | "ready" | "in_delivery", ... }
- Response: { orden actualizada }
- Estado: ✅ Implementado

PUT /admin/orders/:id/assign-courier
- Auth: JWT + Admin
- Body: { courierId: "xxx" }
- Response: { orden actualizada con repartidor }
- Estado: ✅ Implementado

DELETE /admin/orders/:id
- Auth: JWT + Admin
- Response: { message }
- Cancela/elimina orden
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `orders`

```javascript
{
  _id: ObjectId,
  orderNumber: "ORD-2026-04-001",      // ID amigable
  userId: ObjectId | null,              // null si compra sin cuenta
  
  // Cliente
  customerInfo: {
    fullName: "Juan Perez",
    email: "juan@email.com",
    phone: "+34 912345678",
    address: "Calle Principal 123"
  },
  
  // Items de la orden
  items: [
    {
      menuItemId: ObjectId,
      name: "Pizza Margarita",
      quantity: 2,
      price: 12.99,
      subtotal: 25.98
    }
  ],
  
  // Costos
  subtotal: 40.97,
  tax: 4.10,
  shippingCost: 2.00,
  totalAmount: 47.07,
  
  // Envío
  shippingMethod: "delivery" | "pickup" | "express",
  shippingAddress: "Calle Principal 123, Madrid",
  
  // Pago
  paymentMethod: "credit_card" | "paypal" | "cash" | "transfer",
  paymentStatus: "pending" | "completed" | "failed",
  paymentId: "stripe_id_xxx",
  
  // Estado
  status: "pending" | "confirmed" | "preparing" | "ready" | "in_delivery" | "delivered" | "cancelled",
  statusHistory: [
    { status: "pending", timestamp: Date, note: "Pedido recibido" },
    { status: "confirmed", timestamp: Date, note: "Admin confirmó" }
  ],
  
  // Delivery
  courierId: ObjectId | null,           // Repartidor asignado
  estimatedDelivery: Date,
  actualDelivery: Date | null,
  
  // Notas
  notes: "Sin cebolla por favor",
  adminNotes: "Cliente VIP",
  
  timestamps
}
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Create Order** | Crear orden desde checkout | Cliente | ✅ |
| **Get My Orders** | Ver órdenes propias | Cliente autenticado | ✅ |
| **Get Order Details** | Ver detalles orden | Owner o Admin | ✅ |
| **Cancel Order** | Cancelar orden | Cliente (si aún pending) | ✅ |
| **Track Order** | Rastreo en tiempo real | Cualquiera (con link) | ✅ |
| **Update Status** | Cambiar estado | Admin | ✅ |
| **Assign Courier** | Asignar repartidor | Admin | ✅ |
| **Get All Orders** | Ver todas (admin) | Admin | ✅ |
| **Generate Invoice** | Crear factura | Admin | ✅ |

---

## 👥 ROLES Y ACCESO

| Rol | Ver Propias | Ver Todas | Cambiar Estado | Asignar Repartidor |
|-----|------------|----------|----------------|-------------------|
| **Cliente** | ✅ | ❌ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Courier** | ❌ | ❌ | ❌ | ❌ (solo asignadas) |
| **Público** | ❌ | ❌ | ❌ | ❌ |

---

## 🔄 FLUJO DE ESTADO DE ORDEN

```
                    ┌──────────────┐
                    │   PENDING    │ (Recibida)
                    └──────┬───────┘
                           │ Admin confirma
                           ▼
                    ┌──────────────┐
                    │  CONFIRMED   │ (Enviada a cocina)
                    └──────┬───────┘
                           │ Cocina inicia
                           ▼
                    ┌──────────────┐
                    │  PREPARING   │ (En prep)
                    └──────┬───────┘
                           │ Listo
                           ▼
                    ┌──────────────┐
                    │    READY     │ (Listo)
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │ (Delivery)   │ (Pickup)     │
            ▼              ▼              │
    ┌──────────────┐  Recoger en local   │
    │ IN_DELIVERY  │  directamente       │
    └──────┬───────┘                     │
           │ Entregada                    │
           ▼                              │
    ┌──────────────┐                     │
    │  DELIVERED   │◄────────────────────┘
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  COMPLETED   │ (Feedback recibido)
    └──────────────┘

Opcional: → CANCELLED (cualquier punto)
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Crear una orden
```
1. Ir a /menu
2. Agregar productos a carrito
3. Ir a /checkout
4. Completar datos
5. Confirmar compra
6. Ver /booking-confirmation con número de orden
```

### Escenario 2: Ver mis órdenes
```
1. Login como cliente@prueba.com
2. Ir a /my-orders
3. Ver historial de órdenes
4. Mostrar estados
5. Hacer clic en orden
```

### Escenario 3: Rastrear orden
```
1. En /order-tracking/:id
2. Ver línea de tiempo de estados
3. Si en delivery: mostrar ubicación GPS
4. Mostrar información del repartidor
5. Mostrar tiempo estimado
```

### Escenario 4: Admin gestiona órdenes
```
1. Login como admin@prueba.com
2. Ir a /admin/orders
3. Ver tabla de TODAS las órdenes
4. Filtrar por estado
5. Hacer clic en una orden
6. Ver detalles
7. Cambiar estado (ej: pending → confirmed)
8. Asignar repartidor (si delivery)
9. Guardar
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "Orden no encontrada" | ID inválido | Verificar URL |
| "No puedes ver esta orden" | No tienes permisos | Solo owner o admin |
| "No puedo cambiar estado" | No eres admin | Solo admin puede |
| "Estado inválido" | Transición no permitida | Ver flujo de estados |
| "Carrito vacío" | Sin productos | Agregar antes de checkout |

---

## 📊 ESTADÍSTICAS QUE CALCULA

(En dashboard admin)

```
Total órdenes hoy
Órdenes pendientes
Órdenes en preparación
Ingresos del día
Orden más grande
Tiempo promedio preparación
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Crear una orden completa (desde menú hasta confirmación)
- [ ] Ver número de orden generado
- [ ] Ir a /my-orders (si autenticado)
- [ ] Ver historial de órdenes
- [ ] Ver detalles de una orden
- [ ] Mostrar rastreo en /order-tracking/:id
- [ ] Mostrar estados de la orden
- [ ] Si delivery: Mostrar GPS/mapa
- [ ] Login como admin
- [ ] Ver /admin/orders con todas las órdenes
- [ ] Cambiar estado de orden
- [ ] Asignar repartidor
- [ ] Filtrar órdenes por estado/fecha

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Puedo cancelar una orden después?**  
A: Solo si está en estado "pending" o "confirmed". Una vez en cocina, no.

**Q: ¿Cuánto tarda la preparación?**  
A: Depende del producto. Se configura en menú (prepTime).

**Q: ¿Dónde veo mi número de orden?**  
A: En email de confirmación y en /booking-confirmation.

**Q: ¿Puedo ver órdenes en tiempo real?**  
A: Sí, se actualizan automáticamente (WebSockets si está configurado).

---

## 🔗 RELACIONADO CON

- [Módulo 3: Carrito](./03-CART-CHECKOUT.md) - Se crea desde checkout
- [Módulo 6: Pagos](./06-PAYMENTS.md) - Pago asociado a orden
- [Módulo 7: Delivery](./07-DELIVERY.md) - Asignación de repartidor
- [Módulo 8: Admin](./08-ADMIN.md) - Gestión desde panel
- [Módulo 9: Notificaciones](./09-CONTACT-NOTIFICATIONS.md) - Emails de confirmación
