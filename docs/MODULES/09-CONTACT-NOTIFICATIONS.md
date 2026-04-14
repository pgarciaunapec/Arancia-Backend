# 📧 MÓDULO 9: CONTACTO Y NOTIFICACIONES

**Para qué sirve:** Permitir contacto con el restaurante y gestionar notificaciones del sistema.

---

## 📋 FLUJO DE USUARIO

### 📝 Formulario de Contacto

```
1. Usuario navega a http://localhost:3000/contact
2. Ve formulario con campos:
   - Nombre
   - Email
   - Teléfono (opcional)
   - Asunto (dropdown: consulta, sugerencia, reclamo, otro)
   - Mensaje (textarea)
   - Checkbox: "Ver respuesta en email"
3. Completa y hace clic "Enviar"
4. Sistema valida datos
5. Guarda en MongoDB (colección contacts)
6. Envía email automático a admin@restaurante.com
7. Retorna confirmación al usuario
8. Usuario recibe email de confirmación
```

### 🔔 Notificaciones del Sistema

**Para Clientes:**
```
Notificaciones que recibe:
1. Confirmación de orden (email + SMS opcional)
2. Orden en preparación (email/SMS)
3. Repartidor en camino (notificación push)
4. Orden entregada (email)
5. Confirmación de reserva (email)
6. Recordatorio reserva (24h antes)
7. Ofertas/Promociones (si se suscribió)
8. Newsletter (semanal, si se suscribió)
```

**Para Admin:**
```
Notificaciones automáticas de:
1. Nueva orden recibida (inmediato)
2. Nuevo formulario contacto (inmediato)
3. Inventario bajo (diario, 8:00)
4. Reporte diario de ventas (diario, 23:00)
5. Mesa reservada (en el horario)
6. Repartidor no disponible (inmediato)
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Contacto** | `/contact` | Formulario de contacto |
| **Centro de Notificaciones** | `/profile` (sección) | Gestionar preferencias |

---

## 🔗 ENDPOINTS DEL BACKEND

### Contacto (Público)

```
POST /contact
- Auth: No requerido (público)
- Body: {
    name: "Juan Perez",
    email: "juan@email.com",
    phone: "+34 912345678",  // opcional
    subject: "consulta",
    message: "Pregunta sobre...",
    subscribe: true  // suscribirse a respuestas
  }
- Response: {
    contactId,
    message: "Mensaje enviado",
    confirmationNumber
  }
- Email: Enviado a admin automáticamente
- Estado: ✅ Implementado

GET /contact/:contactId
- Auth: No requerido (público, búsqueda por ID)
- Response: { estado, respuesta si hay }
```

### Notificaciones (Requiere autenticación)

```
GET /notifications
- Auth: JWT
- Query: type (order, reservation, etc.), read (true/false)
- Response: [ notificaciones del usuario ]
- Estado: ✅ Implementado

PUT /notifications/:id/read
- Auth: JWT
- Response: { notificación marcada como leída }

PUT /notifications/preferences
- Auth: JWT
- Body: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    categories: {
      orders: true,
      reservations: true,
      promotions: false
    }
  }
- Response: { preferencias actualizadas }
- Estado: ✅ Implementado

DELETE /notifications/:id
- Auth: JWT (o admin)
- Response: { notificación eliminada }
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `contacts`

```javascript
{
  _id: ObjectId,
  confirmationNumber: "CNT-2026-04-001",
  
  // De quién
  name: "Juan Perez",
  email: "juan@email.com",
  phone: "+34 912345678",
  userId: ObjectId | null,    // null si no autenticado
  
  // Contenido
  subject: "consulta" | "sugerencia" | "reclamo" | "otro",
  message: "Texto del mensaje",
  attachments: [ "urls" ],    // opcional
  
  // Estado
  status: "new" | "read" | "responded" | "closed",
  
  // Respuesta
  response: {
    message: "Respuesta del admin",
    respondedBy: ObjectId,
    respondedAt: Date
  },
  
  // Prefer
  subscribe: true,  // quiere respuesta por email
  
  timestamps
}
```

### Colección: `notifications`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  
  // Contenido
  type: "order" | "reservation" | "delivery" | "promotion" | "general",
  title: "Tu orden ha sido confirmada",
  message: "Tu pedido ORD-123 está en preparación",
  action: {
    type: "link",
    url: "/order-tracking/ORD-123"
  },
  
  // Tecnología
  channels: {
    email: true,
    sms: false,
    push: true
  },
  
  // Estado
  read: false,
  sentAt: Date,
  readAt: Date | null,
  
  // Relacionado
  relatedOrderId: ObjectId | null,
  relatedReservationId: ObjectId | null,
  
  timestamps
}
```

### Colección: `notificationpreferences` (opcional)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  
  // Canales
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  
  // Categorías
  categories: {
    orders: true,           // confirmación, actualización, entrega
    reservations: true,     // confirmación, recordatorio
    promotions: false,      // ofertas, descuentos
    newsletter: true,       // newsletter semanal
    generalNews: false      // noticias del restaurante
  },
  
  // Horarios
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00"
  },
  
  updatedAt: Date
}
```

---

## 🔔 TIPOS DE NOTIFICACIONES

| Tipo | Trigger | Canal | Template |
|------|---------|-------|----------|
| **Nueva Orden** | POST /orders | Email | "Tu pedido #XXX fue confirmado" |
| **Orden en Prep** | Admin status change | SMS/Push | "Tu pedido está siendo preparado" |
| **En Delivery** | Courier assigned | Push | "Repartidor en camino, ETA 15 min" |
| **Entregada** | Mark delivered | Email | "Pedido entregado, gracias por tu compra" |
| **Reserva Confirmada** | POST /reservations | Email | "Tu reserva para 4 personas está confirmada" |
| **Recordatorio Reserva** | 24h antes | SMS/Email | "No olvides tu reserva mañana a las 19:30" |
| **Stock Bajo** | Inventory <min | Email | "Stock bajo: Tomates (3 uni), ordena ya" |
| **Oferta Especial** | Promoción activa | Email/SMS | "30% descuento en pizzas hoy" |

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Send Contact** | Enviar formulario | Público | ✅ |
| **Get Notifications** | Ver notificaciones | Cliente autenticado | ✅ |
| **Mark as Read** | Marcar leída | Cliente | ✅ |
| **Delete Notification** | Eliminar | Cliente | ✅ |
| **Set Preferences** | Preferencias | Cliente | ✅ |
| **Send Email** | Enviar email (backend) | Sistema automático | ✅ |
| **Send SMS** | Enviar SMS (backend) | Sistema automático | ✅ |
| **Get Contacts** | Ver formularios (admin) | Admin | ✅ |
| **Respond Contact** | Responder contacto | Admin | ✅ |

---

## 📧 INTEGRACIÓN EMAIL

**Proveedor:** SendGrid o Mailgun

```
Emails automáticos:
1. Confirmación orden
   - De: noreply@arancia.com
   - A: cliente@email.com
   - Template: confirmación-orden.html
   - Incluye: recibo, número orden, rastreo link

2. Contacto recibido
   - De: noreply@arancia.com
   - A: cliente@email.com
   - Template: contacto-recibido.html
   - Incluye: número referencia, link seguimiento

3. Respuesta contacto
   - De: info@arancia.com
   - A: cliente@email.com
   - Template: respuesta-contacto.html
   - Incluye: respuesta del admin

4. Newsletter
   - De: info@arancia.com
   - A: [suscriptores]
   - Template: newsletter-semanal.html
   - Incluye: ofertas, menú, destacados
```

---

## 📱 INTEGRACIÓN SMS

**Proveedor:** Twilio o similar

```
SMS automáticos (condicionales):
- Confirmación orden: "Hola Juan, tu pedido #123 fue confirmado"
- Recordatorio reserva: "Recordatorio: Tienes reserva mañana a las 19:30"
- Entrega: "Tu pedido está en camino, repartidor en 15 min"
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Enviar formulario contacto
```
1. Ir a http://localhost:3000/contact
2. Llenar formulario:
   - Nombre: "María García"
   - Email: "maria@email.com"
   - Asunto: "Consulta"
   - Mensaje: "¿Tienen menú vegetariano?"
3. Hacer clic "Enviar"
4. Ver confirmación con número de referencia
5. (Backend) Verificar email enviado a admin
```

### Escenario 2: Ver notificaciones
```
1. Login como cliente
2. Hacer compra (crear orden)
3. Sistema envía notificación de confirmación
4. En /profile o centro notificaciones
5. Ver notificación listada
6. Ver detalles
7. Marcar como leída
```

### Escenario 3: Preferencias notificaciones
```
1. En /profile, sección "Notificaciones"
2. Ver toggles para cada tipo
3. Desactivar "Promociones"
4. Activar "SMS"
5. Guardar preferencias
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "Email no se envía" | API key inválido | Verificar SendGrid/Mailgun |
| "Notificación no aparece" | Preferencias desactivadas | Activar en /profile |
| "SMS costo muy alto" | Enviar a todos | Usar preferencias |
| "Formulario contacto no guarda" | Validación | Completar todos campos |

---

## ✅ CHECKLIST PARA DEMO

- [ ] Ir a /contact (formulario contacto)
- [ ] Mostrar campos del formulario
- [ ] Explicar que campo "Asunto" tiene opciones
- [ ] Llenar ejemplo y enviar
- [ ] Ver confirmación con número
- [ ] Como cliente, crear orden y monitorear notificaciones
- [ ] Mostrar en /profile sección preferences
- [ ] Explicar cómo se pueden gestionar notificaciones
- [ ] Mencionar que emails se envían automáticamente
- [ ] NOTA: No usar números reales de SMS (costo)

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Recibiré notificaciones después de comprar?**  
A: Sí, automáticamente por email (y SMS si activaste).

**Q: ¿Puedo desactivar notificaciones?**  
A: Sí, en /profile → Notificaciones.

**Q: ¿Dónde veo mis notificaciones?**  
A: En /profile, o recibirás en email/SMS según preferencias.

**Q: ¿Responde alguien mi contacto?**  
A: Sí, admin lo ve y puede responder por email.

---

## 🔗 RELACIONADO CON

- [Módulo 1: Autenticación](./01-AUTHENTICATION.md) - Notificaciones de usuario
- [Módulo 4: Órdenes](./04-ORDERS.md) - Notificaciones de orden
- [Módulo 5: Reservas](./05-RESERVATIONS.md) - Notificaciones de reserva
- [Módulo 8: Admin](./08-ADMIN.md) - Admin ve contactos en panel
