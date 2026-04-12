# CHECKLIST - Arancia Backend

## Pre-flight Git
- [x] Workspace saneado antes de nuevas tareas
- [x] `dev` sincronizada
- [x] Rama por tarea creada desde `dev`
- [x] Aislamiento de cambios por tarea

## Task 1 (Yup middleware + errores estructurados)
- [x] Dependencia `yup` instalada
- [x] Esquemas Yup de auth/contact/reservation/profile/password
- [x] Middleware generico para validar body/params/query
- [x] Auth routes migradas a Yup
- [x] Contact routes migradas a Yup
- [x] Reservation routes migradas a Yup
- [x] User routes con `/profile` y `/password` + Yup
- [x] Compatibilidad `/reservations/my`
- [x] Modelo/tipo Contact corregido
- [x] Build exitoso
- [x] Tests exitosos

## Cierre de tarea
- [x] Commit Task 1
- [x] Merge a `dev`
- [x] Borrado de rama local/remota Task 1

## Task 2 (Soporte backend para Eventos)
- [x] Endpoint `POST /contact/event-quote`
- [x] Validación Yup de event quote
- [x] Build exitoso
- [x] Tests exitosos

## Cierre de tarea
- [x] Commit Task 2
- [x] Merge a `dev`
- [x] Borrado de rama local/remota Task 2

## Ciclo 2026-04-10 - Backlog de Ejecucion

### Task 3 (Persistencia E2E de producto)
- [x] Ordenes con snapshot de `description` e `ingredients` por item
- [x] MenuItem con `description` opcional
- [x] Cart API enriquecida para metadata de item
- [x] DTOs/tipos/validaciones sincronizados
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 4 (Persistencia eventos robusta)
- [x] Validacion explicita de `guests` y `preferredDate`
- [x] Normalizacion de payload de cotizacion de eventos
- [x] Respuesta de persistencia con `_id/status/createdAt`
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 5 (Telefonos RD)
- [x] Sin cambio backend: saneo de telefono ejecutado en frontend previo a API

## Nota operativa
- [x] Limpieza local de ramas completada
- [x] Intento de borrado remoto ejecutado (si la rama no fue publicada, Git devolvio `remote ref does not exist`)

## Ciclo 2026-04-11 - Backlog Admin

### Task 1 (Dashboard real)
- [x] Endpoint `/api/admin/dashboard` ampliado con metricas reales
- [x] Agregado `newUsersToday`
- [x] Agregado `activeOrders`
- [x] Agregado `totalRevenue`
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 2 (Pedidos + notificaciones en tiempo real)
- [x] Estado `shipped` agregado en modelo/tipos/DTO
- [x] Endpoint `/api/notifications` implementado con persistencia MongoDB
- [x] Actualizacion de estado en `OrderService` con eventos de negocio
- [x] Envio de notificacion al usuario al pasar a `shipped`
- [x] Sincronizacion de delivery al pasar a `shipped` y `delivered`
- [x] Build exitoso
- [x] Commit + merge --no-ff

### Task 3 (Filtros modernos + accesibilidad)
- [x] Sin cambios de backend requeridos
- [x] Contrato de `/api/admin/users` validado para filtros avanzados de frontend
- [x] Commit + merge --no-ff (documentacion)

### Task 4 (Mesas + Inventario CRUD sincronizados)
- [x] Modelo `Table` extendido con `image`, `description` e `isActive`
- [x] Asignacion/reasignacion/liberacion automatica de mesa en `ReservationService`
- [x] Endpoint `GET /api/reservations/availability` implementado con filtro por `guests`
- [x] CRUD admin de mesas ampliado con metadata visual
- [x] Endpoint `GET /api/admin/tables/available` implementado
- [x] Modelo `InventoryMovement` creado y exportado
- [x] Endpoints de historial de movimientos implementados (`/movements` y `/:id/movements`)
- [x] Logging de movimientos aplicado en create/update/restock/delete de inventario
- [x] DTO de reservacion devuelve `table` con metadata para frontend
- [x] Build exitoso
- [x] Commit + merge --no-ff
