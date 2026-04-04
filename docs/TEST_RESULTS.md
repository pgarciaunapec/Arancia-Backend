# Resultados de tests — Backend (detallado)

- Fecha: 2026-04-04
- Comando ejecutado: `npm test`

## Resumen rápido

- Total de tests ejecutados: **10**
- Pasaron: **10**
- Archivos de tests:
  - [src/server.test.ts](src/server.test.ts#L1-L400) — 6 tests (unitarios / app-level)
  - [src/test/integration.test.ts](src/test/integration.test.ts#L1-L400) — 4 tests (integración, usan la BD del `env`)

## Detalles por archivo de tests

**[src/server.test.ts](src/server.test.ts#L1-L400)** — Unitarios / App-level

- **`responde health check`**
  - Qué prueba: `GET /api/health` devuelve `200` con `{ status: 'ok', timestamp: string }`.
  - Significado del resultado: la aplicación está respondiendo y la ruta de health check funciona.

- **`responde 404 para rutas inexistentes`**
  - Qué prueba: `GET /api/no-existe` devuelve `404` con `{ error: 'Ruta no encontrada' }`.
  - Significado: el manejador 404 está registrado y responde como se espera.

- **`responde 500 en error no controlado`**
  - Qué prueba: `GET /api/test/error` produce una excepción y debe devolver `500` con un body de error genérico.
  - Significado: el middleware de errores captura excepciones y retorna un `500` (sin exponer mensaje en entornos no-development).

- **`incluye mensaje de error en development`**
  - Qué prueba: con `env.nodeEnv = 'development'` la respuesta al `GET /api/test/error` debe incluir el mensaje de error.
  - Significado: en `development` el handler expone `err.message` para facilitar debugging.

- **`no expone ruta de error de pruebas en production`**
  - Qué prueba: con `env.nodeEnv = 'production'` la ruta `/api/test/error` no debe existir (devuelve `404`).
  - Significado: las rutas de test/debug no están activas en producción.

- **`startServer conecta base de datos y levanta listener`**
  - Qué prueba: `startServer()` llama a `connectDatabase()` y a `app.listen()` (ambos mockeados en el test) y hace logs.
  - Significado: la función de arranque intenta conectar la BD y arranca el listener (en tests se mockea la conexión para no depender de infra).

> Nota: estos tests son mayormente unitarios/funcionales del `app` y muchos de ellos no conectan a la BD real (el test de `startServer` mockea la conexión), los demás ejercitan middlewares y rutas en memoria.

**[src/test/integration.test.ts](src/test/integration.test.ts#L1-L400)** — Tests de integración (usa la BD indicada en `MONGODB_URI`)

- **`auth register & login, create order, update payment and cancel`**
  - Flujo probado: creación de `MenuItem` directo en BD → registro de usuario (`POST /api/auth/register`) → login (`POST /api/auth/login`) → creación de orden (`POST /api/orders`) → verificación de `subtotal`, `tax` (18%) y `total` → cambio de `paymentStatus` (`PUT /api/orders/:id/payment-status`) → cancelación (`POST /api/orders/:id/cancel`) → intento de cancelar nuevamente y validación de error.
  - Significado del resultado: el flujo end-to-end del pedido funciona — la validación de existencia de items, el cálculo de totales, la persistencia, y las reglas de negocio (cancelación) están operando correctamente.

- **`reservations and my-reservations for authenticated user`**
  - Flujo probado: registro de usuario → creación de reservación como guest via `POST /api/reservations` → creación de una reservación ligada al usuario en BD → `GET /api/reservations/my-reservations` con auth y verificación de que lista la reservación del usuario.
  - Significado: el endpoint de reservaciones y el filtro por usuario funcionan; la autenticación para rutas privadas actúa correctamente.

- **`contact event-quote creation and validation error cases`**
  - Flujo probado: `POST /api/contact/event-quote` con payload válido → `201` y respuesta con datos; payload inválido → `400`.
  - Significado: las validaciones y la creación del `EventRequest` funcionan como se espera.

- **`negative cases: invalid menu item in order and unauthorized access`**
  - Flujo probado: intento de crear orden con `menuItem` inexistente → `400` con mensaje `Uno o más artículos no existen`; petición a `/api/reservations/my-reservations` sin token → `401`.
  - Significado: las comprobaciones a nivel de servicio y el middleware de autenticación están rechazando entradas inválidas o accesos no autorizados.

## Condiciones de ejecución y precauciones

- Los tests de integración usan la URI definida en `src/config/env.ts` (`MONGODB_URI`). Revisa: [src/config/env.ts](src/config/env.ts#L1-L200).
- Las pruebas de integración **limpian todas las colecciones** antes de cada test (se ejecuta `deleteMany({})` sobre cada colección para aislar casos). Ver: [src/test/integration.test.ts](src/test/integration.test.ts#L1-L200).
- **IMPORTANTE**: no ejecutar la suite de integración contra una base de datos de producción. Asegura que `MONGODB_URI` apunte a una instancia de pruebas o contenedor aislado.

## Comandos para reproducir

```bash
cd /home/ubuntu/proyectos/Arancia-Backend
npm test
# Ejecutar sólo tests de integración:
npx vitest run src/test/integration.test.ts
```

## Cambios relevantes aplicados para que los tests pasaran

- `src/services/auth.service.ts` — se ajustó la selección del campo `password` para verificar credenciales (`.select('+password')`) y se evitó el doble-hash al registrar/cambiar contraseña (se delega al hook `pre('save')` del modelo). Ver: [src/services/auth.service.ts](src/services/auth.service.ts#L1-L400).
- Nuevo fichero: `src/test/integration.test.ts` (tests de integración añadidos). Ver: [src/test/integration.test.ts](src/test/integration.test.ts#L1-L400).

## Recomendaciones

- Para CI y mayor aislamiento, usar `mongodb-memory-server` o una instancia Mongo dedicada para CI.
- Separar scripts de test: `test:unit` y `test:integration` para ejecutar conjuntos independientes.
- Prevenir borrados accidentales: añadir comprobación explícita de `NODE_ENV` o `TESTING=true` antes de ejecutar `deleteMany` en los tests.
- Integrar estos tests en el pipeline de CI (ej. GitHub Actions) y ejecutar las pruebas de integración en entornos controlados.

## Resultado final

- Todos los tests en este workspace pasaron localmente: **10 passed, 0 failed**.

---

Archivo generado automáticamente con el resumen de ejecución de la suite de tests.
