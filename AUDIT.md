# AUDIT - Arancia Backend

## Protocolo de Git aplicado
- Rama base verificada: `dev`
- Rama de trabajo Task 1: `task/1/forms-tanstack-yup`
- Saneamiento previo completado en rama temporal: `cleanup/feat/admin-module/backend/mvp-crud-form-audit-20260410-160038`
- Aislamiento por tarea: habilitado

## Task 1 - Validacion backend con Yup
### Estado
- Completada y mergeada a `dev`

### Cambios clave
- Dependencia `yup` agregada
- Middleware de validacion estructurada:
  - `src/middleware/yupValidation.middleware.ts`
- Esquemas Yup centralizados:
  - `src/schemas/yup.schemas.ts`
- Rutas migradas a middleware Yup:
  - `src/routes/auth.routes.ts`
  - `src/routes/contact.routes.ts`
  - `src/routes/reservation.routes.ts`
  - `src/routes/user.routes.ts`
- Compatibilidad de rutas frontend/backend:
  - Alias `GET /reservations/my`
  - Endpoints `PUT /users/profile` y `PUT /users/password`
- Correccion de modelo/tipos de contacto para soportar `subject` y estado consistente:
  - `src/models/Contact.ts`
  - `src/types/index.ts`

### Verificacion
- Build: OK (`pnpm run build`)
- Tests: OK (`pnpm run test`)

## Riesgos observados
- Existen reglas antiguas con `express-validator` en rutas no migradas. Convivencia es funcional, pero conviene consolidar en siguiente iteracion.

## Task 2 - Soporte backend para modales de Eventos
### Rama de trabajo
- `task/2/amazon-ui-tracking`

### Estado
- Implementacion completada en rama, con build/tests exitosos

### Cambios clave
- Se habilita endpoint de cotizacion de eventos:
  - `POST /api/contact/event-quote`
  - Archivo: `src/routes/contact.routes.ts`
- Validacion Yup para event quote:
  - `src/schemas/yup.schemas.ts`
- Payload alineado con modal del frontend (`eventType`, `packageName`, `guests`, `preferredDate`, `notes`)

### Verificacion
- Build: OK (`pnpm run build`)
- Tests: OK (`pnpm run test`)

## Ciclo 2026-04-10 - Backlog de Ejecucion (Protocolo Godmode)

### Task 3 - Persistencia E2E de detalle de producto
#### Rama
- `feature/task3-product-persistence`

#### Cambios clave
- Ordenes enriquecidas con snapshot de producto por item:
  - `description`
  - `ingredients[]`
- Catalogo de menu extendido con `description` opcional para detalle expandible frontend.
- Cart API enriquecida para devolver metadata de item en lectura de carrito.
- DTOs/tipos/validaciones actualizados para mantener contrato consistente.

#### Archivos principales
- `src/models/Order.ts`
- `src/services/order.service.ts`
- `src/routes/cart.routes.ts`
- `src/models/MenuItem.ts`
- `src/services/menu.service.ts`
- `src/dtos/order.dto.ts`
- `src/dtos/menuItem.dto.ts`
- `src/types/index.ts`
- `src/utils/validation.util.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 4 - Persistencia de eventos robustecida
#### Rama
- `feature/task4-events-persistence`

#### Cambios clave
- Endpoint `POST /api/contact/event-quote` endurecido:
  - Normalizacion de payload (`name`, `email`, `phone`, `notes`, `packageName`).
  - Validacion explicita de `guests` entero y mayor a 0.
  - Validacion explicita de `preferredDate` cuando es enviada.
  - Respuesta de exito con metadatos de persistencia (`_id`, `status`, `createdAt`).

#### Archivos principales
- `src/routes/contact.routes.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 5 - Telefonos dominicanos
#### Estado backend
- Sin cambios de backend requeridos: limpieza a digitos se ejecuta en frontend antes de enviar payload.

## Observaciones de cierre Git
- Cierres realizados con merge `--no-ff` hacia `dev`.
- Intentos de borrado remoto de rama devolvieron `remote ref does not exist` cuando la rama no habia sido publicada; limpieza local completada.

## Ciclo 2026-04-11 - Backlog Admin de Ejecucion

### Task 1 - Dashboard real y metricas financieras globales
#### Rama
- `feature/task1-dashboard-currency`

#### Cambios clave
- Endpoint admin de dashboard ampliado con metricas reales de MongoDB:
  - `newUsersToday`
  - `activeOrders`
  - `totalRevenue`
  - `todayRevenue`
- Aggregaciones de pagos completados incorporadas para ventas diarias y acumuladas.
- Conteo de pedidos activos conectado a estados operativos (sin mockdata).

#### Archivos principales
- `src/routes/admin/dashboard.routes.ts`

#### Verificacion
- Build: OK (`pnpm run build`)
