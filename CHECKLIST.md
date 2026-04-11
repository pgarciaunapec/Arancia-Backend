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
