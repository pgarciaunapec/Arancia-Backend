# 🪑 MÓDULO 5: RESERVAS DE MESA

**Para qué sirve:** Permite a clientes reservar mesas en el restaurante para comer en el local.

---

## 📋 FLUJO DE USUARIO

### 📅 Hacer una Reservación

```
1. Usuario (autenticado o no) navega a http://localhost:3000/reservations
2. Ve formulario de reservación:
   - Fecha (calendario)
   - Hora (selector de horas)
   - Cantidad de personas (1-10)
   - Nombre del cliente
   - Email y teléfono (opcionales si autenticado)
   - Notas especiales (ej: "cumpleaños")
3. Hace clic en "Buscar disponibilidad"
4. Sistema consulta mesas libres para esa fecha/hora
5. Muestra:
   - Mesas disponibles
   - Capacidad de cada mesa
   - Ubicación (ventana, rincón, bar)
6. Selecciona una mesa
7. Confirma reservación
8. Sistema envía email de confirmación
9. Redirige a /booking-confirmation
```

### ✅ Confirmación de Reservación

```
1. Usuario ve página /booking-confirmation
2. Muestra:
   - Número de confirmación
   - Fecha y hora reservada
   - Cantidad personas
   - Número de mesa
   - Instrucciones especiales
   - Teléfono del restaurante
3. Puede:
   - Descargar confirmación (PDF)
   - Compartir por email
   - Agreglar a calendario (Google Calendar, etc.)
```

### 👀 Ver Mis Reservaciones

```
1. Cliente autenticado navega a http://localhost:3000/my-reservations
2. Ve lista con todas las reservas:
   - Fecha y hora
   - Cantidad personas
   - Estado (confirmed, completed, cancelled)
   - Mesa
   - Horario de confirmación
3. Puede:
   - Ver detalles (haciendo clic)
   - Editar (si aún no pasó la fecha)
   - Cancelar (hasta X horas antes)
```

### ✏️ Editar o Cancelar Reservación

```
1. En /my-reservations, hacer clic en reserva
2. Ver detalles
3. Si aún no llegó la fecha:
   - Botón "Editar": cambiar fecha/hora/personas
   - Botón "Cancelar": cancelar reserva
4. Sistema verifica nueva disponibilidad
5. Guarda cambios
6. Envía email actualizado
```

### 🎛️ Admin Gestiona Mesas y Reservas

```
1. Admin accede a http://localhost:3000/admin/tables
2. Ve:
   - Plano del restaurante con mesas
   - Estado de cada mesa (libre, ocupada, reservada)
   - Horario de ocupación
3. Puede:
   - Crear mesa (número, capacidad, ubicación)
   - Editar mesa
   - Crear reserva manual (para clientes que llamen)
   - Ver reservaciones del día
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Hacer Reservación** | `/reservations` | Formulario y búsqueda |
| **Confirmación** | `/booking-confirmation` | Confirmación post-reserva |
| **Mis Reservas** | `/my-reservations` | Historial de reservaciones |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Mesas** | `/admin/tables` | Gestión de mesas |
| **Admin Reservas** | `/admin/tables/reservations` | Ver todas reservas (calendario) |

---

## 🔗 ENDPOINTS DEL BACKEND

### Reservaciones Público

```
POST /reservations
- Auth: JWT (opcional)
- Body: {
    date: "2026-04-15",
    time: "19:30",
    guestCount: 4,
    customerName: "Juan Perez",
    email: "juan@email.com",
    phone: "+34 912345678",
    specialRequests: "Cumpleaños"
  }
- Response: { reservationId, confirmationNumber, table }
- Estado: ✅ Implementado

GET /reservations/availability
- Query: date, time, guestCount
- Response: [ mesas disponibles ]
- Estado: ✅ Implementado

GET /reservations/my-reservations
- Auth: JWT (obligatorio)
- Response: [ reservaciones del usuario ]
- Estado: ✅ Implementado

GET /reservations/:id
- Response: { detalles reservación }
- Estado: ✅ Implementado

PUT /reservations/:id
- Auth: JWT
- Body: { date, time, guestCount, ... }
- Response: { reservación actualizada }
- Estado: ✅ Implementado

DELETE /reservations/:id
- Auth: JWT
- Response: { message }
- Cancela reservación
- Estado: ✅ Implementado
```

### Admin (Mesas y Reservaciones)

```
GET /admin/tables
- Auth: JWT + Admin
- Response: [ todas las mesas ]
- Estado: ✅ Implementado

POST /admin/tables
- Auth: JWT + Admin
- Body: {
    tableNumber: 5,
    capacity: 4,
    location: "ventana",
    section: "comedor principal"
  }
- Response: { mesa creada }
- Estado: ✅ Implementado

PUT /admin/tables/:id
- Auth: JWT + Admin
- Body: { campos }
- Estado: ✅ Implementado

DELETE /admin/tables/:id
- Auth: JWT + Admin
- Estado: ✅ Implementado

GET /admin/reservations
- Auth: JWT + Admin
- Query: date, status
- Response: [ todas las reservaciones ]
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `tables`

```javascript
{
  _id: ObjectId,
  tableNumber: 5,
  capacity: 4,              // Cantidad máxima personas
  location: "ventana",      // Ubicación especial
  section: "comedor principal",
  isActive: true,
  notes: "Junto a ventana con vista",
  coordinates: {            // Para plano
    x: 100,
    y: 200
  },
  createdAt: timestamp
}
```

### Colección: `reservations`

```javascript
{
  _id: ObjectId,
  confirmationNumber: "RES-2026-04-001",
  
  // Guest info
  guestName: "Juan Perez",
  email: "juan@email.com",
  phone: "+34 912345678",
  userId: ObjectId | null,
  
  // Reservación
  date: Date("2026-04-15"),
  time: "19:30",
  guestCount: 4,
  tableId: ObjectId,
  table: {
    tableNumber: 5,
    capacity: 4
  },
  
  // Estado
  status: "pending" | "confirmed" | "completed" | "no-show" | "cancelled",
  statusHistory: [
    { status: "pending", timestamp, note: "Reserva creada" },
    { status: "confirmed", timestamp, note: "Cliente llamó confirmando" }
  ],
  
  // Detalles
  specialRequests: "Cumpleaños de María",
  checkInTime: Date | null,
  checkOutTime: Date | null,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Create Reservation** | Hacer reserva | Público | ✅ |
| **Get Availability** | Mesas libres | Público | ✅ |
| **Get My Reservations** | Ver mis reservas | Cliente autenticado | ✅ |
| **Update Reservation** | Editar fecha/hora | Owner | ✅ |
| **Cancel Reservation** | Cancelar | Owner | ✅ |
| **Get All Tables** | Listar mesas | Admin | ✅ |
| **Create Table** | Crear mesa | Admin | ✅ |
| **Update Table** | Editar mesa | Admin | ✅ |
| **Delete Table** | Eliminar mesa | Admin | ✅ |
| **Get All Reservations** | Ver todas (admin) | Admin | ✅ |
| **Mark as No-Show** | Marcar como no vino | Admin | ✅ |
| **Check In** | Registrar llegada | Admin | ✅ |

---

## 👥 ROLES Y ACCESO

| Rol | Hacer Reserva | Ver Propias | Editar Propias | Gestionar Mesas |
|-----|-------------|---------|-------------|---------|
| **Público** | ✅ | ❌ | ❌ | ❌ |
| **Cliente** | ✅ | ✅ | ✅ (si pending) | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |

---

## 🕐 DISPONIBILIDAD DE MESAS

```
Sistema verifica:
1. ¿Existe mesa con capacidad >= cantidad solicitada?
2. ¿Está libre en esa fecha/hora?
3. ¿Cuándo se libera (1 hora después)?

Lógica:
- Mesa ocupada 19:00-20:00 = No disponible 19:00-20:15 (buffer)
- Puede reservarse desde 20:30 en adelante
- Horario cierre restaurante (ej: 23:00) = no ofertar después
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Hacer reservación
```
1. Ir a http://localhost:3000/reservations
2. Seleccionar fecha (ej: mañana)
3. Seleccionar hora (ej: 19:30)
4. Cantidad personas (ej: 4)
5. Ingresarar datos (nombre, email)
6. Ver mesas disponibles
7. Seleccionar mesa
8. Confirmar reservación
```

### Escenario 2: Ver confirmación
```
1. Luego de confirmar, ir a /booking-confirmation
2. Ver número de confirmación
3. Ver detalles: fecha, hora, mesa
4. Mostrar opción de descargar/compartir
```

### Escenario 3: Ver mis reservaciones
```
1. Login como cliente@prueba.com
2. Ir a /my-reservations
3. Ver historial de reservas
4. Ver estados (pending, confirmed, etc.)
5. Hacer clic en una para ver detalles
```

### Escenario 4: Admin gestiona mesas
```
1. Login como admin
2. Ir a /admin/tables
3. Ver lista de mesas
4. Ver plano con mesas
5. Ver estado de cada una
6. (Opcional) Crear nueva mesa
7. Ver /admin/tables/reservations
8. Ver calendario de reservaciones del día
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "No hay mesas disponibles" | Todas ocupadas esa hora | Sugerir otra hora |
| "Cantidad invalida" | >10 personas (límite) | Contactar por teléfono |
| "Fecha en el pasado" | Intenta reservar ayer | Seleccionar fecha futura |
| "Hora cerrada" | Fuera de horario | Restaurante cierra a las 23:00 |
| "No puedo editar" | Reserva ya llegó | Solo si es futura |

---

## 📋 REGLAS DE NEGOCIO

```
✓ Reservaciones mínimo 2 personas
✓ Máximo 10 personas por mesa
✓ Tiempo mínimo para hacer reserva: 1 hora antes
✓ Duración reservación: 1.5 horas (configurable)
✓ Cancelación gratuita: hasta 24 horas antes
✓ Horario: 11:00 - 23:00 (configurable)
✓ Cada mesa tiene capacidad máxima
✓ No hay doble-booking de mesas
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar página /reservations
- [ ] Explain búsqueda de disponibilidad
- [ ] Hacer una reservación (paso a paso)
- [ ] Ver /booking-confirmation
- [ ] Mostrar número de confirmación
- [ ] Login como cliente
- [ ] Ir a /my-reservations
- [ ] Ver historial de reservas
- [ ] Ver detalles de una reserva
- [ ] Explicar cómo cancelar (hasta X horas antes)
- [ ] Login como admin
- [ ] Ir a /admin/tables
- [ ] Mostrar mesas disponibles
- [ ] Ver calendario de reservaciones

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Puedo reservar sin crear cuenta?**  
A: Sí, es completamente opcional. Se usa email para confirmación.

**Q: ¿Cuánto tiempo dura una reservación?**  
A: 1.5 horas (configurable por admin).

**Q: ¿Puedo cancelar una reserva?**  
A: Sí, hasta 24 horas antes sin costo.

**Q: ¿Qué mesas hay disponibles?**  
A: Depende del horario. Sistema muestra disponibles en tiempo real.

**Q: ¿Puedo modificar la reservación después?**  
A: Sí, si aún no pasó la fecha. Puedo cambiar fecha/hora/cantidad.

---

## 🔗 RELACIONADO CON

- [Módulo 1: Autenticación](./01-AUTHENTICATION.md) - Usuario autenticado ve historial
- [Módulo 9: Notificaciones](./09-CONTACT-NOTIFICATIONS.md) - Email de confirmación
- [Módulo 8: Admin](./08-ADMIN.md) - Gestión de mesas desde panel
