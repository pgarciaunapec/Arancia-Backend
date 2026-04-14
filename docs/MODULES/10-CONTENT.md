# 📸 MÓDULO 10: CONTENIDO ESTÁTICO

**Para qué sirve:** Mostrar información del restaurante, galería, eventos, servicios.

---

## 📋 ESTRUCTURA DE CONTENIDO

### 1. HOME / INICIO

**URL:** http://localhost:3000/

```
+─────────────────────────────────────────┐
│ ARANCIA RESTAURANT                      │
├─────────────────────────────────────────┤
│                                         │
│  HÉROE: Imagen grande + CTA             │
│  "🍽️ Bienvenido a Arancia"              │
│  [Ver Menú] [Reservar Mesa]             │
│                                         │
├─────────────────────────────────────────┤
│  Secciones destacadas:                  │
│                                         │
│  🌟 Especialidades                      │
│  ├─ Pizza Margarita                     │
│  ├─ Pasta Carbonara                     │
│  └─ Tiramisú                            │
│                                         │
│  📅 Próximos Eventos                    │
│  ├─ Viernes: DJ en vivo                 │
│  └─ Sábado: Cena especial               │
│                                         │
│  ⭐ Reseñas de Clientes                 │
│  ├─ "¡Excelente comida!" - María        │
│  └─ "Muy buen servicio" - Juan          │
│                                         │
│  📞 Contacto rápido                     │
│  Teléfono, email, horarios              │
└─────────────────────────────────────────┘
```

---

### 2. PÁGINA INFORMACIÓN / ACERCA DE

**URL:** http://localhost:3000/about

```
Contenido:
- Misión del restaurante
- Historia y trayectoria
- Valores y filosofía
- Equipo/Chef
- Certificaciones
- Ubicación en mapa
- Horarios de apertura
```

---

### 3. SERVICIOS

**URL:** http://localhost:3000/services

```
Servicios que ofrece:
1. 🍽️ Comer en Local
   - Mesas disponibles
   - Ambiente acogedor
   - Servicio de meseros

2. 🚗 Delivery
   - Entrega a domicilio
   - Órdenes online
   - Rastreo en vivo

3. 📦 Para Llevar
   - Compra rápida
   - Empaque especial
   - Pago al recoger

4. 🎉 Eventos Especiales
   - Cumpleaños
   - Bodas
   - Eventos corporativos
   - Catering

5. 🥘 Categorización
   - Menú vegetariano
   - Opciones sin GLuten
   - Alérgenos controlados

6. 💳 Métodos de Pago
   - Tarjeta
   - PayPal
   - Efectivo
```

---

### 4. GALERÍA

**URL:** http://localhost:3000/gallery

```
+──────────────────────────────────────┐
│ Galería de Fotos                     │
├──────────────────────────────────────┤
│                                      │
│  Grid de fotos del restaurante:      │
│                                      │
│  [Foto 1]  [Foto 2]  [Foto 3]        │
│  [Foto 4]  [Foto 5]  [Foto 6]        │
│  [Foto 7]  [Foto 8]  [Foto 9]        │
│                                      │
│  Al hacer click:                     │
│  - Abre en lightbox (pantalla grande)│
│  - Ver en alta resolución             │
│  - Botón anterior/siguiente           │
│  - Descripción de foto               │
│                                      │
│  Categorías:                         │
│  - Platos                            │
│  - Ambiente                          │
│  - Eventos                           │
│  - Equipo                            │
│                                      │
└──────────────────────────────────────┘
```

---

### 5. EVENTOS

**URL:** http://localhost:3000/events

```
Eventos especiales:
1. DJ en Vivo (Viernes)
   - 21:00 - 23:00
   - Reserva recomendada
   - Entrada gratuita

2. Noche de Cine (Miércoles)
   - Películas en pantalla grande
   - Comida especial
   - Ambiente relajado

3. Promoción Especial
   - 30% descuento en pizzas
   - Solo hoy (mostrar fecha)
   - Ver menú de promoción

Cada evento muestra:
- Fecha/Hora
- Descripción
- Fotos
- Botón "Reservar" (si aplica)
- Requisitos especiales (si hay)
```

---

### 6. POLÍTICAS Y TÉRMINOS

**URLs:**
- http://localhost:3000/terms
- http://localhost:3000/privacy
- http://localhost:3000/refund-policy

```
Contenido estático:
- Términos y condiciones
- Política de privacidad
- Política de reembolsos
- Política de cancelación
- Disclaimers legales
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Home** | `/` | Landing page |
| **About** | `/about` | Información restaurante |
| **Services** | `/services` | Servicios disponibles |
| **Gallery** | `/gallery` | Fotos del restaurante |
| **Events** | `/events` | Eventos especiales |
| **Términos** | `/terms` | Términos y condiciones |
| **Privacidad** | `/privacy` | Política de privacidad |

---

## 📊 ESTRUCTURA DE DATOS

### Colección: `events`

```javascript
{
  _id: ObjectId,
  title: "DJ en Vivo",
  description: "Disfruta de música en vivo...",
  date: Date("2026-04-19"),
  startTime: "21:00",
  endTime: "23:00",
  image: "url_evento",
  images: [ "url1", "url2" ],
  location: "Arancia Restaurant - Local",
  
  // Detalles
  category: "music" | "food" | "special" | "holiday",
  isFeatured: true,      // mostra en home
  requiresReservation: true,
  capacity: 50,
  description: "Texto completo del evento",
  
  // Económico
  isPromotion: false,
  discountPercent: null,
  discountCode: null,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `galleryitems`

```javascript
{
  _id: ObjectId,
  title: "Pasta Carbonara",
  description: "Nuestra famosa pasta carbonara",
  image: "url_image",
  images: [ "url_high_res" ],
  category: "dishes" | "ambiance" | "team" | "events",
  order: 1,              // para ordenar galería
  visible: true,
  createdAt: Date
}
```

---

## 🔗 ENDPOINTS DEL BACKEND

### Eventos

```
GET /events
- Response: [ eventos activos ]
- Query: category, featured, limit
- Estado: ✅ Implementado

GET /events/:id
- Response: { evento completo }

POST /events (Admin only)
- Auth: JWT + Admin
- Body: { title, description, date, image, ... }
- Response: { evento creado }

PUT /events/:id (Admin only)
- Auth: JWT + Admin
- Body: { campos }

DELETE /events/:id (Admin only)
- Auth: JWT + Admin
```

### Galería

```
GET /gallery
- Query: category, limit, skip
- Response: [ fotos ]
- Estado: ✅ Implementado

POST /gallery (Admin only)
- Auth: JWT + Admin
- Body: { title, image, category }
- Response: { foto creada }
```

### Información Estática

```
GET /info/contact
- Response: { phone, email, address, hours }

GET /info/terms
- Response: { contenido HTML }

GET /info/privacy
- Response: { contenido HTML }
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **View Home** | Home page | Público | ✅ |
| **View About** | Información | Público | ✅ |
| **View Services** | Servicios | Público | ✅ |
| **View Gallery** | Galería fotos | Público | ✅ |
| **View Events** | Eventos | Público | ✅ |
| **View Terms** | Términos | Público | ✅ |
| **Create Event** | Evento nuevo (admin) | Admin | ✅ |
| **Upload Gallery** | Foto nueva (admin) | Admin | ✅ |

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Mostrar home
```
1. Abrir http://localhost:3000
2. Ver hero image
3. Ver menús destacados
4. Ver próximos eventos
5. Ver reseñas
6. Scroll y mostrar secciones
7. Acceso a menú, reservar, contacto
```

### Escenario 2: Explorar galería
```
1. Ir a http://localhost:3000/gallery
2. Ver grid de fotos
3. Hacer click en una foto
4. Ver en lightbox (grande)
5. Navegar anterior/siguiente
6. Cerrar
```

### Escenario 3: Ver eventos
```
1. Ir a http://localhost:3000/events
2. Ver lista de eventos del mes
3. Hacer click en evento
4. Ver detalles (fecha, hora, descripción)
5. Botón "Reservar" (si aplica)
6. Volver a eventos
```

### Escenario 4: Info del restaurante
```
1. Ir a http://localhost:3000/about
2. Leer sobre el restaurante
3. Ver ubicación
4. Ver horarios
5. Ver equipo
```

---

## 📋 CONTENIDO RECOMENDADO

### Home
- Eslogan principal
- Imágenes atractivas
- CTA claros (Menú, Reservar, Delivery)
- Mostrar especialidades (3-4 platos)
- Reseñas/testimonios
- Información de contacto

### Galería
✓ Fotos profesionales de platos
✓ Ambiente del restaurante
✓ Terracita/Exterior
✓ Equipo de cocina
✓ Eventos especiales
✓ Alta resolución (para imprenta)

### Eventos
✓ DJ en vivo (viernes)
✓ Cena especial (sábado)
✓ Happy hour (4-6 PM)
✓ Days especiales (San Valentín, Año Nuevo)
✓ Promociones temporales

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar home (http://localhost:3000)
- [ ] Explicar secciones principales
- [ ] Navegar a /about
- [ ] Navegar a /services
- [ ] Ir a /gallery y mostrar fotos
- [ ] Hacer click en foto para verla grande
- [ ] Ir a /events y mostrar eventos
- [ ] Mencionar que contenido se can editar desde admin
- [ ] Mostrar naturalidad de navegación
- [ ] Explicar que todo es responsive (móvil)

---

## 🐛 NOTAS TÉCNICAS

```
✓ Todas las imágenes optimizadas (WebP formato)
✓ Lazy loading en galería (carga progresiva)
✓ SEO friendly (meta tags en cada página)
✓ URL amigables (no IDs numéricos)
✓ Breadcrumbs de navegación
✓ Responsive design (móvil primera)
✓ Cache de imágenes
✓ Mapas integrados para ubicación
```

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Cómo actualizo fotos de galería?**  
A: Admin puede subir desde panel (no implementado en esta demo).

**Q: ¿Dónde agrego eventos nuevos?**  
A: Actualmente mostrado en home. Admin puede agregar desde backend.

**Q: ¿Se ven en móvil?**  
A: Sí, todas las páginas son responsive.

**Q: ¿Puedo compartir de redes sociales?**  
A: No implementado en esta versión, pero puede agregarse.

---

## 🔗 RELACIONADO CON

- [Módulo 2: Menú](./02-MENU.md) - Desde home acceder a menú
- [Módulo 5: Reservas](./05-RESERVATIONS.md) - Reservar desde eventos
- [Módulo 9: Contacto](./09-CONTACT-NOTIFICATIONS.md) - Contacto desde home
