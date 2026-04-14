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

### Task 5 - Gestion de empleados, asignaciones operativas y flota
#### Rama
- `feature/task5-employee-fleet-assignment`

#### Cambios clave
- Dominio extendido para asignaciones operativas:
  - ordenes con `assignedStaff`, `assignedTable`, `assignedVehicle`, `assignmentNotes`
  - mesas con `assignedStaff`
  - delivery con `assignedTo` y `vehicle`
- Nuevo modulo de flota con persistencia real en MongoDB:
  - modelo `Vehicle`
  - CRUD admin en `/api/admin/fleet`
- Selector de delivery integrado al flujo de envio de pedidos:
  - `OrderService.updateStatus` exige repartidor al pasar a `shipped` en pedidos de delivery
  - asigna repartidor/vehiculo al delivery y a la orden
- Endpoint dedicado para empleados activos:
  - `GET /api/admin/users/employees?includeAdmins=true|false`
- Asignaciones de orden habilitadas desde admin:
  - `PATCH /api/admin/orders/:id/assignment`
- Cuentas de mesa reforzadas:
  - listado `GET /api/admin/table-bills`
  - apertura de cuenta con mesero explicito (`waiterId`) y sincronizacion con mesa.

#### Archivos principales
- `src/models/Vehicle.ts`
- `src/routes/admin/fleet.routes.ts`
- `src/models/Order.ts`
- `src/models/DeliveryOrder.ts`
- `src/models/Table.ts`
- `src/routes/admin/order.routes.ts`
- `src/routes/admin/delivery.routes.ts`
- `src/routes/admin/table.routes.ts`
- `src/routes/admin/tableBill.routes.ts`
- `src/routes/admin/user.routes.ts`
- `src/services/order.service.ts`
- `src/services/delivery.service.ts`
- `src/types/index.ts`
- `src/server.ts`

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

### Task 2 - Sincronizacion de pedidos y notificaciones en tiempo real
#### Rama
- `feature/task2-orders-realtime-notifications`

#### Cambios clave
- Estado de orden `shipped` agregado a modelo, tipos, DTOs y documentacion swagger.
- Endpoint de notificaciones persistidas agregado (`/api/notifications`) con lectura de no leidas y marcado individual/global.
- Cambio de estado de orden centralizado en `OrderService` con efectos de dominio:
  - actualizacion de delivery a `in_transit` al pasar a `shipped`
  - notificacion inmediata al usuario al enviarse el pedido
  - cierre de delivery al marcar `delivered`
- Endpoint admin de cambio de estado conectado a `OrderService` para no saltar reglas ni eventos.

#### Archivos principales
- `src/models/Notification.ts`
- `src/routes/notification.routes.ts`
- `src/services/order.service.ts`
- `src/models/Order.ts`
- `src/dtos/order.dto.ts`
- `src/types/index.ts`
- `src/routes/admin/order.routes.ts`
- `src/server.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 3 - Modernizacion de filtros y UI de usuarios
#### Rama
- `feature/task3-admin-filters-toolbar`

#### Cambios clave
- Sin cambios de API requeridos en backend para Task 3.
- Se valida compatibilidad del endpoint de usuarios (`/api/admin/users`) con filtros de frontend por rol/estado/fecha ya que retorna `role`, `isVip` y `createdAt`.

#### Verificacion
- Backend sin cambios funcionales de codigo para esta tarea.

### Task 4 - Modulo de Mesas e Inventario CRUD sincronizado
#### Rama
- `feature/task4-tables-inventory-sync`

#### Cambios clave
- Modelo `Table` ampliado con `image`, `description` e `isActive`.
- Flujo de reservaciones sincronizado con mesas:
  - asignacion automatica por capacidad en creacion
  - reasignacion y liberacion de mesa en actualizacion/cancelacion/confirmacion
- Endpoint de disponibilidad para reservas con filtro por comensales:
  - `GET /api/reservations/availability?guests=N`
- CRUD admin de mesas extendido con metadata visual y endpoint de disponibilidad:
  - `GET /api/admin/tables/available`
- Trazabilidad de inventario implementada con nuevo modelo `InventoryMovement` y endpoints de historial:
  - `GET /api/admin/inventory/movements`
  - `GET /api/admin/inventory/:id/movements`
- Registro de movimientos en create/update/restock/delete de inventario.
- DTO de reservacion actualizado para devolver metadata de mesa y sincronizar frontend.

#### Archivos principales
- `src/models/Table.ts`
- `src/models/Reservation.ts`
- `src/models/InventoryMovement.ts`
- `src/services/reservation.service.ts`
- `src/routes/reservation.routes.ts`
- `src/controllers/reservation.controller.ts`
- `src/routes/admin/table.routes.ts`
- `src/routes/admin/inventory.routes.ts`
- `src/dtos/reservation.dto.ts`
- `src/types/index.ts`

#### Verificacion
- Build: OK (`pnpm run build`)

### Task 6 - Facturacion y comprobantes con QR unico
#### Rama
- `feature/task6-invoices-qr-collections`

#### Cambios clave
- Nuevo dominio `Invoice` con persistencia real en MongoDB para pedidos y cuentas de mesa.
- Servicio `InvoiceService` para:
  - generacion de codigo unico (`INV-YYYYMMDD-XXXXXX` / `TBL-YYYYMMDD-XXXXXX`)
  - generacion de QR (`data:image/png;base64`) con payload serializado
- Emision automatica de comprobante al procesar pagos de pedidos (`/api/payments`).
- Emision automatica de comprobante al cerrar cuentas POS (`/api/admin/table-bills/:id/close`).
- API de comprobantes para usuario y administracion:
  - `GET /api/invoices/my`
  - `GET /api/invoices/order/:orderId`
  - `GET /api/invoices/:id`
  - `GET /api/admin/invoices`
  - `GET /api/admin/invoices/:id`

#### Archivos principales
- `src/models/Invoice.ts`
- `src/services/invoice.service.ts`
- `src/routes/invoice.routes.ts`
- `src/routes/admin/invoice.routes.ts`
- `src/routes/payment.routes.ts`
- `src/routes/admin/tableBill.routes.ts`
- `src/models/index.ts`
- `src/server.ts`
- `src/types/index.ts`

#### Verificacion
- Build: OK (`pnpm run build`)


## Ciclo 2026-04-14 - Estabilización para Producción

### Task 1 - Optimización Pasarela: Direcciones y Tarjetas Guardadas
ESTADO: COMPLETADA
- User model con savedAddresses[] y savedCards[]
- Endpoints CRUD: /me/saved-addresses, /me/saved-cards
- Seguridad: cardHash nunca retornado, solo últimos 4 dígitos
- Build OK - Merged a dev

### Task 2 - Disponibilidad de Mesas por Fecha
ESTADO: COMPLETADA
- ReservationService.getAvailability() cruza fechas/horas con reservas existentes
- Excluye mesas bookadas automáticamente
- Endpoint: GET /reservations/availability?guests=N&date=YYYY-MM-DD&time=HH:MM
- Build OK - Merged a dev

### Task 3 - Sistema de Notificaciones (Frontend)
ESTADO: COMPLETADA
- Zustand toastStore + ToastContainer con animaciones
- Hook useToast() con success/error/info/warning
- Auto-dismiss 5s, bottom-right positioning
- Build OK - Merged a dev

### Task 4 - Gestión de Imágenes y URLs
ESTADO: DOCUMENTADO
- Plan: Descargar URLs a Buffer/Base64
- Guía de implementación en src/docs/

### Task 5 - Seguridad Admin
ESTADO: COMPLETADA
- Middleware adminAuthMiddleware valida roles en tiempo real
- Consulta BD para verificar rol actual (previene escalada)
- 403 si rol fue revocado
- Build OK - Merged a dev

### Task 6 - Seeding e Inventario
ESTADO: DOCUMENTADO
- Plan: Seed script + Flujo de caja
- Guía en src/docs/ para next phase

Todas 6 tareas cubiertas. Protocolo --no-ff aplicado.
