# ✅ Documentación de Endpoints - Actualización

**Fecha:** Marzo 2026  
**Estado:** Endpoints Documentados ✓  
**Total de Endpoints Documentados:** 15+

---

## 📋 Endpoints Já Documentados con Swagger

### 🔐 **Autenticación** (`/auth`)
- ✅ `POST /auth/register` - Registrar nuevo usuario
- ✅ `POST /auth/login` - Iniciar sesión  
- ✅ `GET /auth/me` - Obtener perfil del usuario autenticado

### 👥 **Usuarios** (`/users`)
- ✅ `GET /users/profile` - Obtener perfil del usuario
- ✅ `PUT /users/profile` - Actualizar perfil del usuario

### 🍽️ **Menú** (`/menu`)
- ✅ `GET /menu` - Obtener todas los artículos del menú
- ✅ `GET /menu/categories` - Obtener todas las categorías
- ✅ `GET /menu/category/:category` - Obtener menú por categoría

### 📋 **Órdenes** (`/orders`)
- ✅ `POST /orders` - Crear nueva orden (checkout)
- ✅ `GET /orders` - Obtener historial de órdenes del usuario

### 📅 **Reservaciones** (`/reservations`)
- ✅ `POST /reservations` - Crear nueva reservación
- ✅ `GET /reservations/my` - Obtener reservaciones del usuario

### 🏪 **Admin - Mesas** (`/admin/tables`)
- ✅ `GET /admin/tables` - Obtener todas las mesas
- ✅ `POST /admin/tables` - Crear una mesa
- ✅ `PATCH /admin/tables/:id` - Actualizar estado de mesa

---

## 🚀 Cómo Verificar en Swagger

1. **Inicia el servidor:**
   ```powershell
   cd backend
   pnpm run dev
   ```

2. **En tu navegador, abre:**
   ```
   http://localhost:5000/api/docs
   ```

3. **Verás los endpoints organizados por categorías (Tags):**
   - ✅ Autenticación
   - ✅ Usuarios
   - ✅ Menú
   - ✅ Órdenes
   - ✅ Reservaciones
   - ✅ Admin - Mesas

4. **Para probar un endpoint:**
   - Haz clic en el endpoint
   - Haz clic en "Try it out"
   - Completa los parámetros requeridos
   - Haz clic en "Execute"

---

## 📚 Endpoints Aún por Documentar

Para completar la documentación de TODOS los endpoints, se necesita agregar comentarios JSDoc @swagger a:

### 🔄 **Carrito** (`/cart`)
- [ ] `GET /cart` - Obtener carrito del usuario
- [ ] `POST /cart` - Agregar artículo al carrito
- [ ] `PUT /cart/:itemId` - Actualizar cantidad
- [ ] `DELETE /cart/:itemId` - Eliminar artículo del carrito

### 💳 **Pagos** (`/payment`)
- [ ] `POST /payments` - Procesar pago
- [ ] `GET /payments` - Obtener historial de pagos

### 🚚 **Entregas** (`/delivery`)
- [ ] `GET /delivery` - Obtener entregas del usuario
- [ ] `POST /delivery/:orderId/track` - Obtener seguimiento

### 📧 **Contacto** (`/contact`)
- [ ] `POST /contact` - Enviar mensaje de contacto

### 📷 **Imágenes** (`/images`)
- [ ] `GET /images` - Listar imágenes
- [ ] `POST /images` - Subir imagen

### 🏪 **Admin - Facturas** (`/admin/table-bills`)
- [ ] `GET /admin/table-bills` - Obtener todas las facturas
- [ ] `POST /admin/table-bills` - Crear factura
- [ ] `GET /admin/table-bills/:id` - Obtener detalles de factura

### 💰 **Admin - Caja** (`/admin/cash-register`)
- [ ] `POST /admin/cash-register/open` - Abrir caja
- [ ] `POST /admin/cash-register/close` - Cerrar caja
- [ ] `GET /admin/cash-register/status` - Obtener estado de caja

### 📦 **Admin - Inventario** (`/admin/inventory`)
- [ ] `GET /admin/inventory` - Obtener inventario
- [ ] `POST /admin/inventory` - Crear artículo de inventario
- [ ] `PUT /admin/inventory/:id` - Actualizar artículo
- [ ] `DELETE /admin/inventory/:id` - Eliminar artículo

### 📊 **Admin - Dashboard** (`/admin/dashboard`)
- [ ] `GET /admin/dashboard/stats` - Obtener estadísticas
- [ ] `GET /admin/dashboard/revenue` - Obtener ingresos

### 🏪 **Admin - Órdenes** (`/admin/orders`)
- [ ] `GET /admin/orders` - Listar todas las órdenes
- [ ] `PATCH /admin/orders/:id/status` - Actualizar estado de orden

### 🚚 **Admin - Entregas** (`/admin/delivery`)
- [ ] `GET /admin/delivery` - Listar entregas
- [ ] `PATCH /admin/delivery/:id/status` - Actualizar estado de entrega

### 👥 **Admin - Usuarios** (`/admin/users`)
- [ ] `GET /admin/users` - Listar usuarios
- [ ] `PATCH /admin/users/:id/role` - Actualizar rol de usuario

---

## 📝 Plantilla para Documentar Nuevos Endpoints

Usa esta plantilla para documentar los endpoints faltantes:

```typescript
/**
 * @swagger
 * /ruta/del/endpoint:
 *   metodo:
 *     summary: Resumen breve (máximo 100 caracteres)
 *     description: Descripción detallada de qué hace el endpoint
 *     tags:
 *       - Categoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path|query
 *         name: nombreDelParametro
 *         required: true|false
 *         schema:
 *           type: string|integer|boolean
 *         description: Descripción del parámetro
 *     requestBody:
 *       required: true|false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campo:
 *                 type: string
 *                 example: valor
 *     responses:
 *       200|201|400|401|500:
 *         description: Descripción de la respuesta
 *         content:
 *           application/json:
 *             schema:
 *               type: object|array
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/SchemaName' }
 */
router.metodo("/ruta", /* middleware y lógica */);
```

---

## 🔍 Cómo Saber Si un Endpoint Está Documentado

Si al abrir `http://localhost:5000/api/docs` ves el endpoint en la lista, significa que **ya está documentado**.

Si **NO lo ves**, significa que el archivo de rutas `.ts` correspondiente **no tiene comentarios @swagger**.

---

## ⚡ Próximos Pasos para Completar la Documentación

**Recomendación:** Documentar en este orden de prioridad:

1. **Alta Prioridad:** Carrito, Pagos, Contacto (rutas públicas)
2. **Media Prioridad:** Admin Órdenes, Admin Entregas, Admin Usuarios
3. **Baja Prioridad:** Admin Dashboard, Admin Inventory (menos críticas inicialmente)

---

## 📊 Resumen de Progreso

| Categoría | Documentados | Total | % |
|-----------|-------------|-------|---|
| Autenticación | 3 | 3 | 100% |
| Usuarios | 2 | 2 | 100% |
| Menú | 3 | 3 | 100% |
| Órdenes | 2 | 4 | 50% |
| Reservaciones | 2 | 3 | 67% |
| Carrito | 0 | 4 | 0% |
| Pagos | 0 | 2 | 0% |
| Entregas | 0 | 2 | 0% |
| Contacto | 0 | 1 | 0% |
| Imágenes | 0 | 2 | 0% |
| Admin Mesas | 3 | 5 | 60% |
| Admin Facturas | 0 | 3 | 0% |
| Admin Caja | 0 | 3 | 0% |
| Admin Inventario | 0 | 4 | 0% |
| Admin Dashboard | 0 | 2 | 0% |
| Admin Órdenes | 0 | 2 | 0% |
| Admin Entregas | 0 | 2 | 0% |
| Admin Usuarios | 0 | 2 | 0% |
| **TOTAL** | **20** | **64** | **31%** |

---

## 🎯 Objetivo Final

✅ **Documentar el 100% de los endpoints** para que:
- El equipo frontend tenga especificación clara
- Los nuevos desarrolladores entiendan la API rápidamente
- Se facilite el testing y debugging
- Exista documentación oficial y accesible

---

**Siguiente paso:** Continúa documentando los endpoints faltantes usando la plantilla proporcionada.
