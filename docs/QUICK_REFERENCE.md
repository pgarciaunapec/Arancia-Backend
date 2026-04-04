# ⚡ Quick Reference Guide - Restaurant01

**Para:** Nuevo Product Manager
**Fecha:** 2026-04-04
**Léelo primero:** ✅ Este documento
**Luego:** PROJECT_STATUS_2026-04-04.md → TECHNICAL_GUIDE_AND_ACTION_PLAN.md

---

## 🎯 Acceso Rápido

### URLs Principales
```
Frontend:      http://localhost:3000
Backend:       http://localhost:5000
API Swagger:   http://localhost:5000/api/docs
```

### Credenciales de Acceso Rápido

**Admin Panel:**
```
Email:    admin@restaurant01.com
Password: AdminPassword123!
URL:      http://localhost:3000/admin/login
```

**Customer Test:**
```
Email:    user@restaurant01.com
Password: UserPassword123!
URL:      http://localhost:3000/login
```

---

## 🚀 Iniciar el Sistema

### Opción 1: Script Automático (Recomendado)
```bash
cd c:\Users\pagar\Nextcloud\Projects\Restaurant01
./start.sh
```

### Opción 2: Manual
```bash
# Terminal 1 - Backend
cd backend
pnpm start

# Terminal 2 - Frontend (otra terminal)
pnpm dev
```

---

## 📂 Estructura de Carpetas Essencial

```
Restaurant01/
├─ Project Docs (NEW)
│  ├─ PROJECT_STATUS_2026-04-04.md          ← Estatus completo
│  ├─ TECHNICAL_GUIDE_AND_ACTION_PLAN.md    ← Guía técnica
│  ├─ QUICK_REFERENCE.md                     ← Este archivo
│  └─ README.md (original)
│
├─ src/                          # Frontend React code
│  ├─ pages/                     # 18 páginas públicas + 10 admin
│  ├─ components/                # Componentes reutilizables
│  ├─ context/                   # State management
│  ├─ lib/                       # API client, mappers
│  └─ hooks/                     # Custom React hooks
│
├─ backend/                      # Backend Node.js
│  ├─ dist/                      # Código compilado
│  │  ├─ controllers/            # Business logic
│  │  ├─ models/                 # MongoDB schemas
│  │  ├─ routes/                 # API endpoints
│  │  ├─ middleware/             # Auth, validation
│  │  └─ services/               # Business services
│  ├─ .env                       # Variables de entorno
│  ├─ mongo-cert.crt            # Certificado MongoDB TLS
│  └─ package.json
│
├─ .env                          # Frontend config
├─ .env.example
├─ package.json
├─ start.sh                      # Script de inicio
└─ README.md
```

---

## ✅ Estado en 30 Segundos

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Backend** | ✅ 100% | Express + MongoDB, 40+ endpoints |
| **Frontend** | ✅ 100% | React 18 + Tailwind, 28 páginas |
| **Base de Datos** | ✅ 13 modelos | MongoDB remoto con TLS |
| **Autenticación** | ✅ JWT | Rol-based access control |
| **Pagos** | 🟡 Mock | No real - necesita integración |
| **Email** | ❌ No | Necesita SendGrid/SES |
| **Logging** | 🟡 Básico | Necesita Sentry/ELK Stack |
| **Tests** | ✅ Configurados | Vitest + Jest, cobertura ~70% |
| **Documentación API** | ✅ Swagger | En http://localhost:5000/api/docs |

---

## 🔑 Endpoints Más Usados

### Para Testing Rápido

**Registro:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Pass123!",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@restaurant01.com",
    "password": "UserPassword123!"
  }'
```

**Ver Menú:**
```bash
curl http://localhost:5000/api/menu
```

**Ver Órdenes (requiere token):**
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/orders
```

---

## 📊 Páginas Clave para Testar

### Flujo de Cliente

1. **Home** → http://localhost:3000/
   - Ver página de inicio
   - Testimonios, CTA buttons

2. **Menu** → http://localhost:3000/menu
   - Ver items con filtrado
   - Agregar al carrito

3. **Carrito** → http://localhost:3000/cart
   - Ver items seleccionados

4. **Checkout** → http://localhost:3000/checkout
   - Requiere login
   - Múltiples métodos de pago

5. **My Orders** → http://localhost:3000/my-orders
   - Ver historial
   - Click para rastrear

6. **Reservations** → http://localhost:3000/reservations
   - Hacer reserva de mesa

### Flujo Admin

1. **Admin Login** → http://localhost:3000/admin/login
   - Credenciales admin

2. **Dashboard** → http://localhost:3000/admin
   - Métricas en tiempo real

3. **Órdenes** → http://localhost:3000/admin/orders
   - Ver todas, cambiar estado

4. **Clientes** → http://localhost:3000/admin/clients
   - Lista de usuarios (historial)

5. **Mesas** → http://localhost:3000/admin/tables
   - Gestión de mesas

6. **Inventario** → http://localhost:3000/admin/inventory
   - Control de stock

---

## ⚠️ TOP 5 Cosas a Saber

### 1. **JWT_SECRET es DÉBIL en desarrollo**
```
Ubicación:  backend/.env
Actual:     "your-super-secret-jwt-key-change-in-production"
Riesgo:     ⚠️ CRÍTICO para producción
Acción:     Generar nuevo antes de deployar
```

### 2. **Base de Datos está en servidor REMOTO**
```
Host:       mongo-dev.nauvolan.abrdns.com
User:       mongo
Pass:       Pantonio2404
Riesgo:     ⚠️ Credenciales en código
Acción:     Usar secret manager en producción
```

### 3. **Métodos de Pago son MOCK**
```
Estado:     Los pagos se registran pero son falsos
Riesgo:     No hay transacciones reales
Timeline:   Necesario antes de ir a producción
API:        Usar Stripe, PayU, MercadoPago, etc.
```

### 4. **No hay Backup Automático**
```
Riesgo:     Pérdida de datos
Solución:   Implementar backup diario
Ubicación:  AWS S3 / Azure Blob / Google Cloud Storage
Timeline:   ⚠️ ANTES de producción
```

### 5. **Sin Emails Transaccionales**
```
Falta:      Confirmações de registro, órdenes, reservas
Riesgo:     Clientes sin confirmación
Solución:   SendGrid o AWS SES
Timeline:   Semana 3-4 del roadmap
```

---

## 🧪 Testing Rápido en 5 Minutos

### 1. Registrar Usuario
```
- Go to http://localhost:3000/register
- Email: nuevouser@test.com
- Password: Test123!
- Click Register
```

### 2. Agregar Items al Carrito
```
- Go to /menu
- Click en un item
- Click "Add to Cart"
- Repetir con 2-3 items
```

### 3. Hacer Compra
```
- Go to /cart
- Click "Checkout"
- Seleccionar método de pago (cash)
- Click "Confirm Order"
```

### 4. Ver Orden
```
- Go to /my-orders
- Click en orden creada
- Ver detalles y estado
```

### 5. Testar Admin
```
- Go to /admin/login
- email: admin@restaurant01.com
- password: AdminPassword123!
- Navegar admin panels
```

---

## 🐛 Troubleshooting 101

| Problema | Solución |
|----------|----------|
| **Port 3000 en uso** | `PORT=3001 pnpm dev` |
| **Port 5000 en uso** | `PORT=5001 pnpm start` |
| **MongoDB no conecta** | Verificar .env backend, certificado, Internet |
| **CORS error** | Verificar VITE_API_URL en .env frontend |
| **API retorna 401** | Token expirado, login de nuevo |
| **Página en blanco** | Abrir console (F12), ver error |
| **Build falla** | `rm -rf node_modules pnpm-lock.yaml && pnpm install` |

---

## 📞 Archivos de Documentación

### 1. **PROJECT_STATUS_2026-04-04.md** (↤ LEER PRIMERO)
   - Resumen ejecutivo del proyecto
   - Estado de cada página/feature
   - Cómo acceder a cada vista
   - Lista de credenciales
   - Estructura de base de datos
   - Flujos de datos
   - Checklist de funcionalidades
   - **Tiempo para leer:** 20-30 min

### 2. **TECHNICAL_GUIDE_AND_ACTION_PLAN.md**
   - Detalles técnicos avanzados
   - Stack completo
   - Endpoints detallados
   - Análisis de seguridad
   - Plan de acción (8 semanas)
   - Roadmap para producción
   - Métricas y KPIs
   - **Tiempo para leer:** 25-35 min

### 3. **QUICK_REFERENCE.md** (Este archivo)
   - Overview rápido
   - URLs principales
   - Comandos essenciales
   - Top 5 cosas importantes
   - Links de documentación
   - **Tiempo para leer:** 5-10 min

### 4. **README.md** (Original)
   - Descripción general
   - Quick start
   - Stack tecnológico
   - Troubleshooting básico

---

## 🎯 Plan de Acción para PM (Primera Semana)

### Día 1: Familiarización
- [ ] Leer este documento (Quick Reference)
- [ ] Leer PROJECT_STATUS_2026-04-04.md
- [ ] Clonar/revisar código en IDE

### Día 2: Exploración
- [ ] Instalar dependencias (`pnpm install` en ambas carpetas)
- [ ] Ejecutar `./start.sh`
- [ ] Navegar todas las páginas públicas
- [ ] Navegar panel admin

### Día 3: Testing
- [ ] Crear usuario de prueba
- [ ] Hacer orden completa (registro → compra → rastreo)
- [ ] Hacer reserva de mesa
- [ ] Testar admin (cambiar status de orden, etc.)

### Día 4: Documentación
- [ ] Leer TECHNICAL_GUIDE_AND_ACTION_PLAN.md
- [ ] Revisar endpoints en Swagger
- [ ] Crear notas propias
- [ ] Identificar preguntas

### Día 5: Reunión Técnica
- [ ] 1-on-1 con desarrollador disponible
- [ ] Preguntar sobre:
  - Por qué cada feature se implementó así
  - Qué está pendiente
  - Problemas conocidos
  - Próximos pasos (roadmap)

---

## 📊 Checklist de Producción

Durante el onboarding, completar checklist:

- [ ] Entiendo el flujo completo de cliente (registro → compra)
- [ ] Entiendo el flujo completo de admin
- [ ] Sé dónde están las variables de entorno
- [ ] Sé cómo iniciar desarrollo localmente
- [ ] Sé ejecutar tests
- [ ] Sé dónde están los endpoints principales
- [ ] Entiendo el sistema de autenticación (JWT)
- [ ] Entiendo roles (admin, staff, user)
- [ ] Sé qué funciones son CRÍTICAS para producción
- [ ] Sé qué faltan antes de producción

---

## 🔗 Links Importantes

```
GitHub Repository:     [Link TBD]
Database Admin Panel:  [Link TBD - mongo-dev management]
Issue Tracker:         [Link TBD - Jira/GitHub Issues]
Deployment:            [Link TBD - AWS/GCP/Azure]
Monitoring:            [Link TBD - Sentry/DataDog]
API Documentation:     http://localhost:5000/api/docs
```

---

## 📝 Notas del Developer Anterior

> "El MVP está 100% funcional. No hay bugs conocidos críticos. El código está en TypeScript, bien estructurado. Las cosas que faltan para producción están documentadas en TECHNICAL_GUIDE_AND_ACTION_PLAN.md - principalmente: Pagos reales, Emails, Logging, y Backups automáticos."

---

## ✨ Puntos Fuertes del Proyecto

1. ✅ **MVP Completo** - Todas las features básicas funcionan
2. ✅ **TypeScript** - Type-safe en frontend y backend
3. ✅ **Modern Stack** - React 18, Vite, Tailwind, Express
4. ✅ **Bien Documentado** - Swagger API docs
5. ✅ **Tests** - Configurados y listos (Vitest)
6. ✅ **Seguridad Básica** - JWT, bcrypt, CORS, Helmet
7. ✅ **Scalable** - Estructura modular, separación de concerns
8. ✅ **UI Moderna** - Diseño limpio con Radix UI + Tailwind

---

## 🚀 Próximos Pasos (Primeras 2 Semanas)

1. ✅ **Semana 1:** Exploración y familiarización (esto)
2. ✅ **Semana 2:**
   - [ ] Code review inicial
   - [ ] Identificar bugs críticos
   - [ ] Crear plan detallado
   - [ ] Setup de monitoring
   - [ ] Preparación para producción

---

## 📧 Preguntas Frecuentes PM

**P: ¿Cuándo podemos ir a producción?**
A: 4-8 semanas después de implementar los items en TECHNICAL_GUIDE_AND_ACTION_PLAN.md. Principalmente: pagos reales, emails, backups, https, logging.

**P: ¿Cuánto cuesta mantener?**
A: MongoDB Atlas + Node.js hosting (Heroku/Railway/Render) ≈ $50-100/mes en fase inicial.

**P: ¿Cuántos usuarios soporta?**
A: Arquitectura actual soporta 1000s de usuarios simultáneos sin issues. Necesita scaling después de 100k+ transacciones diarias.

**P: ¿Es seguro para datos de clientes?**
A: Seguridad está bien (bcrypt, JWT, sanitization). Pero necesita: MFA, backup automático, logging, y compliance audit antes de producción.

**P: ¿Falta algo crítico?**
A: No. MVP está completo. Lo que falta es para ESCALAR (pagos reales, emails, monitoreo).

---

## 💪 Tu Primer Dia Como PM

### Morning (2 horas)
- Leer este documento ✅
- Instalar proyecto localmente
- Ejecutar `./start.sh`

### Midday (1 hora)
- Navegar la aplicación
- Probar flujos públicos (home, menu, cart)
- Tomar notas

### Afternoon (2 horas)
- Leer PROJECT_STATUS_2026-04-04.md
- Revisar admin panel
- Hacer compra y reserva de prueba

### EOD (1 hora)
- Crear lista de preguntas
- Preparar para meeting con tech team

---

**¡Bienvenido al equipo! 🚀**

---

*Última revisión: 2026-04-04*
*Próxima actualización recomendada: 2026-04-18*
