# 🔐 MÓDULO 1: AUTENTICACIÓN Y GESTIÓN DE USUARIOS

**Para qué sirve:** Permite a los usuarios crear cuenta, iniciar sesión, actualizar perfil y cambiar contraseña.

---

## 📋 FLUJO DE USUARIO

### 🆕 Registro de Nuevo Usuario

```
1. Usuario llega a http://localhost:3000/register
2. Ve formulario con campos:
   - Nombre completo
   - Email
   - Contraseña
   - Confirmar contraseña
3. Hace clic en "Registrarse"
4. Sistema valida datos
5. Se crea cuenta en MongoDB
6. Se genera JWT token
7. Usuario autenticado → Redirige a Home
8. Token guardado en localStorage (navegador)
```

### 🔑 Iniciar Sesión

```
1. Usuario en http://localhost:3000/login
2. Ingresa Email y Contraseña
3. Hace clic en "Iniciar Sesión"
4. Backend valida credenciales
5. Si correctas:
   - Se genera JWT token
   - Usuario redirige a Home
   - Token enviado en Authorization header de API
6. Si incorrectas:
   - Mensaje de error
   - Intenta de nuevo
```

### 👤 Actualizar Perfil

```
1. Usuario autenticado navega a http://localhost:3000/profile
2. Ve su información:
   - Nombre
   - Email
   - Teléfono
   - Dirección
   - Preferencias de notificación
3. Edita campos
4. Hace clic en "Guardar"
5. Datos actualizados en MongoDB
6. Confirmación en pantalla
```

### 🔐 Cambiar Contraseña

```
1. En perfil (/profile), sección "Seguridad"
2. Ingresa contraseña actual
3. Nueva contraseña
4. Confirma nueva contraseña
5. Hace clic en "Actualizar"
6. System valida contraseña actual
7. Cambia en base de datos
8. Mensaje de éxito
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Registro** | `/register` | Formulario para crear cuenta nueva |
| **Login** | `/login` | Formulario para iniciar sesión |
| **Perfil** | `/profile` | Ver y editar datos personales |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Login** | `/admin/login` | Login especial para administradores |
| **Admin Usuarios** | `/admin/users` | Gestionar usuarios del sistema |

---

## 🔗 ENDPOINT DEL BACKEND

### Autenticación Pública

```
POST /auth/register
- Body: { email, password, fullName, phone (opcional) }
- Response: { user, token }
- Rate Limit: 20 intentos cada 15 minutos
- Estado: ✅ Implementado

POST /auth/login
- Body: { email, password }
- Response: { user, token }
- Rate Limit: 20 intentos cada 15 minutos
- Estado: ✅ Implementado

POST /auth/logout
- Auth: JWT token requerido
- Response: { message: "Sesión cerrada" }
- Estado: ✅ Implementado
```

### Perfil (Requiere Autenticación)

```
GET /auth/me
- Auth: JWT token requerido
- Response: { user data }
- Obtiene: Datos del usuario autenticado
- Estado: ✅ Implementado

PUT /auth/profile
- Auth: JWT token requerido
- Body: { fullName, phone, address, preferences }
- Response: { user actualizado }
- Estado: ✅ Implementado

POST /auth/change-password
- Auth: JWT token requerido
- Body: { currentPassword, newPassword }
- Response: { message }
- Validación: Verifica contraseña actual
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `users`

```javascript
{
  _id: ObjectId,
  email: "usuario@ejemplo.com",           // Único
  password: "hash_encriptado",            // Nunca en texto plano
  fullName: "Juan Perez",
  phone: "+34 912345678",
  address: "Calle Principal 123, Madrid",
  role: "customer" | "admin" | "delivery", // Rol del usuario
  createdAt: timestamp,
  updatedAt: timestamp,
  isActive: true | false,
  profileImage: "url_imagen",
  preferences: {
    notifications: true,
    newsletter: true,
    language: "es"
  }
}
```

---

## 🔒 SEGURIDAD IMPLEMENTADA

| Medida | Descripción |
|--------|-------------|
| **JWT Token** | Token expirable tras logout/timeout |
| **Password Hash** | Contraseñas encriptadas con bcrypt |
| **HTTPS/SSL** | Todas conexiones encriptadas |
| **CORS** | Solo dominios permitidos acceden |
| **Rate Limiting** | 20 intentos de login cada 15 min |
| **Input Validation** | Validación con Yup en backend |
| **Authorization** | Middleware verifica token en cada request |

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Quién ejecuta |
|---------|-------------|---------------|
| **Registrar** | Crear nueva cuenta | Cliente público |
| **Login** | Iniciar sesión | Cualquier usuario |
| **Logout** | Cerrar sesión | Usuario autenticado |
| **Get Profile** | Ver datos personales | Usuario autenticado |
| **Update Profile** | Editar información | Usuario autenticado |
| **Change Password** | Cambiar contraseña | Usuario autenticado |
| **Verify Token** | Validar JWT | Sistema (cada request) |
| **Add Token to Header** | Enviar en Authorization | Frontend (automático) |

---

## 👥 ROLES Y ACCESO

| Rol | Puede Hacer | No Puede | Página |
|-----|------------|---------|--------|
| **Sin autenticar (Público)** | Ver menú, carrito, contacto | Comprar, reservar, ver perfil | `/`, `/menu`, `/contact` |
| **Cliente** | Todo público + comprar + reservar + ver perfil | Admin | `/profile`, `/my-orders` |
| **Admin** | Todo + gestionar usuarios/órdenes/inventario | Nada está bloqueado | `/admin/*` |
| **Delivery** | Ver órdenes asignadas + tracking | Admin panel + profile usuarios | `/orders` (especial) |

---

## 🔄 FLUJO TÉCNICO DETRÁS DE ESCENAS

```
Usuario completar formulario registro
↓
Frontend valida (email y contraseña)
↓
POST /auth/register con datos
↓
Backend:
  1. Valida formato email
  2. Verifica email no exista
  3. Encripta contraseña con bcrypt
  4. Crea documento en MongoDB
  5. Genera JWT token
  6. Devuelve token + datos user
↓
Frontend:
  1. Recibe token
  2. Guarda en localStorage
  3. Configura Authorization header
  4. Redirige a Home
↓
A partir de ahora:
- Cada request lleva Authorization: "Bearer {token}"
- Middleware valida token
- Acceso a rutas protegidas
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Registrar nuevo usuario
```
1. Ir a http://localhost:3000/register
2. Completar formulario con datos nuevos
3. Ver confirmación
4. Automáticamente en Home autenticado
5. Ir a /profile para ver cambios
```

### Escenario 2: Login con cuenta existente
```
1. Ir a http://localhost:3000/login
2. Usar credenciales: cliente@prueba.com / Prueba123!
3. Sesión iniciada
4. Ir a /profile
5. Ver datos personales
```

### Escenario 3: Cambiar contraseña
```
1. En /profile
2. Ir a sección "Seguridad"
3. Cambiar contraseña
4. Logout y login con nueva contraseña
```

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| "Email ya está registrado" | Email duplicado | Usar otro email |
| "Email o contraseña no coinciden" | Credenciales incorrectas | Verificar datos |
| "Contraseña muy débil" | No cumple requisitos | Mín 8 caracteres, mayús, número |
| "Token expirado" | Sesión cerrada | Login nuevamente |
| "No autorizado" | Sin token o token inválido | Verificar autenticación |

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar página de login
- [ ] Mostrar página de registro
- [ ] Explicar que se puede comprar sin cuenta
- [ ] Hacer login con usuario existente
- [ ] Ir a /profile y mostrar datos
- [ ] Mencionar que datos se sincronizan con backend
- [ ] Explicar JWT (token en navegador)
- [ ] Mostrar logout y cómo se borra token

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Los usuarios pueden comprar sin crear cuenta?**  
A: Sí, el carrito y checkout funcionan sin autenticación. Los datos se pueden proporcionar en checkout.

**Q: ¿Dónde se guarda el token?**  
A: En localStorage del navegador. Se envía automáticamente en el header de cada request.

**Q: ¿Cuál es la contraseña del admin?**  
A: admin@prueba.com / Admin123! (solo accede a /admin/login)

**Q: ¿Se pueden recuperar contraseñas?**  
A: Actualmente no está implementado. En producción se implementaría reset por email.

---

## 🔗 RELACIONADO CON

- [Módulo 4: Órdenes](./04-ORDERS.md) - Usuario autenticado crea órdenes
- [Módulo 5: Reservas](./05-RESERVATIONS.md) - Usuario autenticado reserva mesa
- [Módulo 8: Admin](./08-ADMIN.md) - Admin login especial con credenciales diferentes
- [Módulo 3: Cart](./03-CART-CHECKOUT.md) - Carritos de usuarios autenticados
