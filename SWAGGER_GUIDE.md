# 📚 Integración de Swagger

Swagger ha sido integrado al backend de Restaurant01. Esto proporciona documentación automática e interactiva de todos los endpoints de la API.

## Acceder a la Documentación

Abre tu navegador y ve a:
```
http://localhost:5000/api/docs
```

> Reemplaza `5000` con el puerto configurado en tu `.env` si es diferente.

## Características

✅ Documentación automática de endpoints  
✅ Interfaz interactiva para probar endpoints  
✅ Visualización de esquemas de respuesta  
✅ Soporte para autenticación JWT  
✅ Ejemplos de peticiones y respuestas  

## Cómo Documentar una Ruta

Para agregar documentación Swagger a un endpoint, agrega comentarios JSDoc sobre la ruta con las anotaciones de Swagger.

### Ejemplo Básico

```typescript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *               phone:
 *                 type: string
 *                 example: "+1-555-0123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/register", /* middleware y lógica */);
```

### Ejemplo con Autenticación

```typescript
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna los datos del usuario autenticado
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/profile", authMiddleware, /* lógica */);
```

### Ejemplo con Parámetros

```typescript
/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Obtener detalles de una orden
 *     tags:
 *       - Órdenes
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 */
router.get("/:orderId", /* lógica */);
```

## Estructura del Proyecto para Documentación

El archivo de configuración Swagger se encuentra en:
```
backend/src/config/swagger.ts
```

Este archivo contiene:
- **Definición de información de la API** (título, versión, descripción)
- **Configuración de servidores** (desarrollo y producción)
- **Esquemas reutilizables** (User, MenuItem, Order, etc.)

Las rutas documentadas se cargan automáticamente desde los archivos .ts en:
```
backend/src/routes/**/*.routes.ts
```

## Tags para Categorizar Endpoints

Usa tags para organizar los endpoints por funcionalidad:

```typescript
tags:
  - Autenticación    // Registro, login
  - Usuarios         // Perfil, actualizar datos
  - Menú             // Consultar, buscar
  - Órdenes          // Crear, obtener, cancelar
  - Reservaciones    // Crear, actualizar, cancelar
  - Pagos            // Procesar, historial
  - Entregas         // Seguimiento
  - Admin - Usuarios
  - Admin - Mesas
  - Admin - Caja
  - Admin - Inventario
  - Admin - Dashboard
```

## Esquemas Disponibles

Los siguientes esquemas ya están definidos y listos para usar:

- `User` - Modelo de usuario
- `MenuItem` - Artículo del menú
- `Order` - Orden de cliente
- `Reservation` - Reservación de mesa
- `Payment` - Registro de pago
- `Table` - Mesa del restaurante
- `Error` - Respuesta de error estándar

Para referenciar: `$ref: '#/components/schemas/User'`

## Códigos HTTP Más Comunes

| Código | Significado | Caso de Uso |
|--------|------------|-----------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Falta autenticación |
| 403 | Forbidden | Sin permisos suficientes |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error interno del servidor |

## Testing en Swagger UI

Una vez que hayas documentado los endpoints:

1. Abre `http://localhost:5000/api/docs`
2. Haz clic en un endpoint para expandirlo
3. Haz clic en "Try it out"
4. Completa los parámetros requeridos
5. Haz clic en "Execute"
6. Verás la respuesta en tiempo real

## Próximos Pasos

1. **Documentar todas las rutas** - Agrega comentarios JSDoc con anotaciones Swagger a todos los endpoints
2. **Validar esquemas** - Asegúrate que los esquemas coincidan con los datos retornados
3. **Agregar ejemplos** - Incluye ejemplos realistas en las respuestas
4. **Mantener actualizado** - Cuando hagas cambios en rutas, actualiza la documentación Swagger también

## Recursos

- [Documentación OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Editor Swagger Online](https://editor.swagger.io/)
