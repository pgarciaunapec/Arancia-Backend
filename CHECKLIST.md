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
- [ ] Commit Task 1
- [ ] Merge a `dev`
- [ ] Borrado de rama local/remota Task 1
