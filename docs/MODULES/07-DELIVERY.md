# 🚗 MÓDULO 7: DELIVERY Y RASTREO

**Para qué sirve:** Gestionar la entrega de órdenes, asignar repartidores y rastrear en tiempo real.

---

## 📋 FLUJO DE USUARIO

### 🚗 Cliente Rastrea Entrega

```
1. Cliente tiene orden con método "delivery"
2. Navega a http://localhost:3000/order-tracking/:orderId
3. Ve:
   - Estado actual: "in_delivery"
   - Nombre del repartidor
   - Foto del repartidor
   - Teléfono para contactar
   - Ubicación en MAPA (GPS en tiempo real)
   - Tiempo estimado de llegada
   - Botón para contactar repartidor
4. Mapa muestra:
   - Ubicación restaurante (origen)
   - Ubicación cliente (destino)
   - Ruta actual del repartidor
   - Icono repartidor moviéndose
5. Cliente puede:
   - Actualizar ubicación de entrega
   - Contactar repartidor por teléfono
   - Chat con repartidor (si implementado)
   - Ver instrucciones especiales
```

### 🎛️ Admin Asigna Repartidor

```
1. Admin accede a http://localhost:3000/admin/orders
2. Ve orden con status "ready"
3. Necesita entrega
4. Hace clic en orden
5. Ve botón "Asignar Repartidor"
6. Elige de lista:
   - Repartidores disponibles
   - Ubicación actual
   - Cantidad entregas día
7. Confirma
8. Sistema calcula ruta
9. Notifica repartidor
10. Estado cambia a "in_delivery"
```

### 📲 Repartidor Recibe Orden

```
1. Repartidor en aplicación móvil (o web)
2. Recibe notificación de nueva orden
3. Ve:
   - Restaurante (origen)
   - Cliente (destino)
   - Detalles orden
   - Dirección de entrega
4. Hace clic "Aceptar"
5. Ve ruta optimizada en mapa
6. Conduce siguiendo ruta
7. Llega al restaurante
8. Fotografía empaque (confirmación)
9. Parte hacia cliente
10. GPS se actualiza en tiempo real
11. Llama/chat con cliente si requiere
12. Llega al destino
13. Cliente confirma recibo
14. Repartidor marca como entregado
```

### ✅ Confirmación de Entrega

```
1. Repartidor llega a ubicación cliente
2. Sistema detecta GPS coincide
3. Repartidor toma foto de entrega
4. Cliente recibe notificación de llegada
5. Cliente sale, recibe orden
6. Repartidor marca "Entregado"
7. Sistema actualiza estado a "delivered"
8. Cliente ve orden completada en /order-tracking/:id
9. Ambos pueden dejar reseña (opcional)
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Rastreo** | `/order-tracking/:id` | Mapa + estado entrega en tiempo real |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Entregas** | `/admin/delivery` | Gestión de entregas |
| **Flota** | `/admin/fleet` | Gestión de repartidores |

---

## 🔗 ENDPOINTS DEL BACKEND

### Cliente (Rastreo)

```
GET /delivery/:orderId
- Response: {
    status: "in_delivery",
    courier: { name, phone, photo },
    location: { lat, lng },
    route: [],
    estimatedArrival: Date,
    distance: 2.5  // km
  }
- Actualización: WebSockets o polling cada 10 seg
- Estado: ✅ Implementado

GET /delivery/:orderId/location
- Response: { lat, lng, timestamp }
- Frecuencia: Cada 30 segundos
- Estado: ✅ Implementado
```

### Admin (Gestión)

```
GET /admin/delivery
- Auth: JWT + Admin
- Response: [ órdenes en delivery ]
- Estado: ✅ Implementado

POST /admin/delivery/:orderId/assign
- Auth: JWT + Admin
- Body: { courierId: "xxx" }
- Response: { assignment }
- Notificación: Enviada a repartidor
- Estado: ✅ Implementado

PUT /admin/delivery/:orderId/status
- Auth: JWT + Admin
- Body: { status: "in_delivery", courierLocation: { lat, lng } }
- Response: { updated }
- Estado: ✅ Implementado

GET /admin/couriers
- Auth: JWT + Admin
- Response: [ repartidores ]
- Mostra: nombre, status, ubicación, órdenes del día
- Estado: ✅ Implementado
```

### Repartidor (Móvil/Web)

```
POST /delivery/update-location
- Auth: JWT (courier token)
- Body: { lat, lng, accuracy }
- Response: { nextOrder, message }
- Frecuencia: Cada 30 segundos
- Estado: ✅ Implementado

PUT /delivery/:orderId/mark-delivered
- Auth: JWT (courier token)
- Body: { photo: "base64", notes: "" }
- Response: { success }
- Estado: ✅ Implementado

GET /delivery/my-orders
- Auth: JWT (courier token)
- Response: [ órdenes asignadas ]
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `deliveryorders`

```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  
  // Repartidor
  courierId: ObjectId,
  courier: {
    name: "Carlos Garcia",
    phone: "+34 612345678",
    photo: "url_photo"
  },
  
  // Ubicación
  origin: {
    name: "Arancia Restaurant",
    address: "Calle Principal 123",
    lat: 40.4168,
    lng: -3.7038
  },
  
  destination: {
    name: "Cliente",
    address: "Calle Secundaria 456",
    lat: 40.4200,
    lng: -3.7050
  },
  
  // Ruta
  route: {
    polyline: "encoded_string",
    distance: 2.5,        // km
    duration: 12,         // minutos
    stops: []
  },
  
  // Rastreo
  currentLocation: {
    lat: 40.4175,
    lng: -3.7043,
    accuracy: 10,
    timestamp: Date
  },
  
  // Timeline
  timestamps: {
    assigned: Date,
    picked_up: Date,
    in_transit: Date,
    estimated_arrival: Date,
    delivered: Date
  },
  
  // Confirmación
  deliveryProof: {
    photo: "url_photo",
    signature: "signature_base64",
    notes: "Entregado al cliente"
  },
  
  // Estado
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "failed",
  
  // Calidad
  rating: 1-5,
  review: "Muy rápido"
}
```

### Colección: `couriers` (Repartidores)

```javascript
{
  _id: ObjectId,
  
  // Personal
  name: "Carlos Garcia",
  email: "carlos@delivery.com",
  phone: "+34 612345678",
  
  // Documentos
  document: "12345678A",
  licensePhoto: "url",
  insuranceDoc: "url",
  
  // Vehículo
  vehicle: {
    type: "motorcycle" | "car" | "bicycle",
    model: "Honda CB500",
    plate: "ABC-1234",
    color: "Negro"
  },
  
  // Ubicación
  currentLocation: {
    lat: 40.4200,
    lng: -3.7100,
    timestamp: Date
  },
  
  // Estado
  status: "available" | "busy" | "offline",
  activeOrders: 2,
  acceptedOrders: 45,
  cancelledOrders: 2,
  
  // Calidad
  rating: 4.8,
  totalDeliveries: 150,
  
  // Horario
  workingHours: {
    monday: { start: "10:00", end: "22:00" }
  }
}
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Track Delivery** | Ver ubicación en mapa | Cliente | ✅ |
| **Get Location Updates** | Actualizaciones GPS | Cliente | ✅ |
| **Assign Courier** | Asignar repartidor | Admin | ✅ |
| **Update Location** | Enviar ubicación | Repartidor | ✅ |
| **Mark Delivered** | Confirmar entrega | Repartidor | ✅ |
| **Get My Orders** | Órdenes del repartidor | Repartidor | ✅ |
| **Get All Deliveries** | Ver todas entregas | Admin | ✅ |
| **Cancel Delivery** | Cancelar entrega | Admin | ✅ |
| **Optimize Route** | Calcular mejor ruta | Backend | ✅ |

---

## 🗺️ INTEGRACIÓN DE MAPAS

```
Proveedor: Google Maps API (o Mapbox)

Funcionalidades:
- Mostrar mapa interactivo
- Marcar origen (restaurante)
- Marcar destino (cliente)
- Mostrar ruta
- Updatear ubicación repartidor (polyline se mueve)
- Calcular distancia/tiempo
- Mostrar icono repartidor

API calls:
- Directions API: Ruta
- Geocoding API: Convertir dirección a lat/lng
- Distance Matrix: Distancias entre puntos
- Elevation API: Altitud
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Ver rastreo de orden
```
1. Crear orden con método "delivery"
2. Esperar a que admin asigne repartidor
3. Ir a /order-tracking/:orderId
4. Ver mapa con ubicación restaurante
5. Ver ubicación cliente (destino)
6. Ver datos del repartidor
7. Mostrar teléfono para contactar
```

### Escenario 2: Admin asigna repartidor
```
1. Login como admin
2. Ir a /admin/orders
3. Ver orden con status "ready"
4. Hacer clic para ver detalles
5. Botón "Asignar Repartidor"
6. Elegir de lista disponibles
7. Confirmar asignación
8. Ver que estado cambió a "in_delivery"
```

### Escenario 3: Ver flota de repartidores
```
1. Admin en /admin/fleet
2. Ver tabla con repartidores
3. Mostar: nombre, ubicación actual, órdenes
4. Ver mapa con todos los repartidores
5. Ver rating y entregas completadas
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "GPS no funciona" | Permisos no otorgados | Aceptar permisos en app |
| "Mapa no se carga" | API key inválida | Verificar Google Maps |
| "Ruta no calcula" | Dirección inválida | Corregir dirección |
| "No hay repartidores" | Todos ocupados | Esperar o contactar admin |
| "Ubicación antigua" | Conexión lenta | RefCurso manual |

---

## 📋 REGLAS DE NEGOCIO

```
✓ Solo órdenes "ready" pueden entregarse
✓ Repartidor puede tener máx 3 órdenes simultáneas
✓ Actualización GPS cada 30 segundos
✓ Tiempo máximo entrega: 60 minutos (configurable)
✓ Bonificación si entrega <30 minutos
✓ Penalización si retraso
✓ Rating mínimo para continuar: 4.0/5.0
✓ Seguro de responsabilidad civil obligatorio
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Crear orden con método delivery
- [ ] Admin asigna repartidor
- [ ] Ir a /order-tracking/:id
- [ ] Mostrar mapa con ubicación
- [ ] Mostrar datos de repartidor
- [ ] Explicar actualización GPS en tiempo real
- [ ] (Opcional) Admin panel de repartidores
- [ ] (Opcional) Ver flota en mapa
- [ ] Explicar que repartidor ve órdenes en su app
- [ ] NOTA: GPS será simulado en demo (no real)

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Cómo se rastrea el repartidor?**  
A: GPS cada 30 segundos. El mapa se actualiza en tiempo real.

**Q: ¿Cuánto tarda la entrega?**  
A: Normalmente 30-45 minutos desde el restaurante.

**Q: ¿Puedo contactar al repartidor?**  
A: Sí, teléfono visible en /order-tracking/:id.

**Q: ¿Qué pasa si el repartidor no llega?**  
A: Puedes contactar a admin. Reembolso disponible.

**Q: ¿Confirmación de entrega?**  
A: Repartidor toma foto. Cliente confirma al recibir.

---

## 🔗 RELACIONADO CON

- [Módulo 4: Órdenes](./04-ORDERS.md) - Estado in_delivery
- [Módulo 8: Admin](./08-ADMIN.md) - Asignación desde admin
- [Módulo 3: Checkout](./03-CART-CHECKOUT.md) - Selecciona delivery
