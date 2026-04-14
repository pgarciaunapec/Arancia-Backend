# 🛒 MÓDULO 3: CARRITO Y CHECKOUT

**Para qué sirve:** Permite agregar productos al carrito, calcular total, y procesar pago.

---

## 📋 FLUJO DE USUARIO

### 🛒 Agregar Producto al Carrito

```
1. Usuario en /menu
2. Ve producto "Pizza Margarita"
3. Hace clic en "Agregar al Carrito"
4. Elige cantidad (por defecto 1)
5. Confirma agregar
6. Producto se agrega al carrito
7. Badge en icono carrito muestra cantidad (+1)
```

### 🛍️ Ver Carrito

```
1. Usuario hace clic en icono Carrito (top navbar)
2. Navega a http://localhost:3000/cart
3. Ve:
   - Todos los productos agregados
   - Cantidad de cada uno
   - Precio individual
   - Subtotal
   - Impuestos
   - Total
   - Botones: Seguir comprando, Proceder a checkout
```

### ✏️ Modificar Carrito

```
1. En /cart, usuario puede:
   - Aumentar cantidad (botón +)
   - Disminuir cantidad (botón -)
   - Remover item (X)
2. Total se actualiza automáticamente
3. Cambios se sincronizan con localStorage
```

### 💳 Proceso Checkout

```
1. Usuario hace clic en "Proceder a Checkout"
2. Va a http://localhost:3000/checkout
3. Si NO está autenticado:
   - Formulario para datos de entrega
   - Email, nombre, teléfono, dirección
   - Opción para crear cuenta (opcional)
4. Si está autenticado:
   - Datos pre-llenados de perfil
   - Puede editarlos
5. Selecciona método de envío:
   - Delivery (a domicilio)
   - Envío Express
   - Recoger en sucursal
6. Selecciona método de pago:
   - Tarjeta de crédito
   - PayPal
   - Efectivo a la entrega
   - Transferencia
7. Confirma pedido
8. Vuelve a /order-confirmation o /order-tracking
```

### 📦 Opciones de Envío

```
1. Delivery normal (2-3 horas): $2.00
2. Delivery express (30-45 min): $5.00
3. Recoger en local (listo en 20 min): GRATUITO
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Carrito** | `/cart` | Ver productos agregados |
| **Checkout** | `/checkout` | Formulario de pago |
| **Confirmación Orden** | `/booking-confirmation` | Confirmación después de comprar |

### Componentes (en ambas páginas)

| Componente | Localización | Función |
|------------|-------------|---------|
| **Mini Carrito** | Header/Navbar | Badge con cantidad items |
| **Resumen Orden** | Sidebar checkout | Muestra total a pagar |
| **Formulario Envío** | Página checkout | Datos de entrega |
| **Selector Pago** | Página checkout | Elegir método pago |

---

## 🔗 ENDPOINTS DEL BACKEND

### Carrito (Requiere localización en cliente)

```
Nota: El carrito es LOCAL en el navegador (localStorage)
No hay endpoints de carrito en backend. El usuario maneja el estado localmente.
```

### Órdenes (Crear desde Checkout)

```
POST /orders
- Auth: JWT (opcional, si no hay sesión se usa email)
- Body: {
    items: [
      { menuItemId: "xxx", quantity: 2, price: 12.99 },
      { menuItemId: "yyy", quantity: 1, price: 8.50 }
    ],
    customerInfo: {
      fullName: "Juan Perez",
      email: "juan@email.com",
      phone: "+34 912345678",
      address: "Calle Principal 123"
    },
    shippingMethod: "delivery" | "express" | "pickup",
    paymentMethod: "credit_card" | "paypal" | "cash" | "transfer",
    totalAmount: 45.99,
    taxAmount: 3.99,
    notes: "Sin cebolla por favor"
  }
- Response: { orderId, status, confirmationNumber }
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Carrito (Lado Cliente - localStorage)

```javascript
// En navegador, NO en DB
{
  items: [
    {
      menuItemId: "ObjectId",
      name: "Pizza Margarita",
      price: 12.99,
      quantity: 2,
      image: "url"
    },
    {
      menuItemId: "ObjectId",
      name: "Pasta Carbonara",
      price: 14.99,
      quantity: 1,
      image: "url"
    }
  ],
  lastUpdated: timestamp
}
```

### Órdenes (Base de Datos - MongoDB)

Ver Módulo 4 (ORDERS) para estructura de órdenes.

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Dónde | Estado |
|---------|-------------|-------|--------|
| **Add to Cart** | Agregar producto | Frontend | ✅ |
| **Remove from Cart** | Sacar del carrito | Frontend | ✅ |
| **Update Quantity** | Cambiar cantidad | Frontend | ✅ |
| **Clear Cart** | Vaciar carrito | Frontend | ✅ |
| **Calculate Total** | Suma + impuestos + envío | Frontend | ✅ |
| **Get Shipping Options** | Obtener métodos envío | Backend | ✅ |
| **Get Payment Methods** | Obtener métodos pago | Backend | ✅ |
| **Create Order** | Procesar pago y crear orden | Backend | ✅ |
| **Persist Cart** | Guardar en localStorage | Frontend | ✅ |
| **Restore Cart** | Cargar desde localStorage | Frontend | ✅ |

---

## 👥 ROLES Y ACCESO

| Rol | Puede Ver Carrito | Puede Checkout |
|-----|------------------|-----------------|
| **Público (sin login)** | ✅ Sí | ✅ Sí (con email) |
| **Cliente Autenticado** | ✅ Sí | ✅ Sí (dados pre-llenados) |
| **Admin** | ✅ Sí | ❌ No |

---

## 🏗️ FLUJO TÉCNICO

```
Usuario agrega producto a carrito
↓
Frontend Context (CartContext):
  1. Verifica si producto ya existe
  2. Si existe: aumenta quantity
  3. Si no: añade a items array
  4. Calcula total
  5. Guarda en localStorage
  6. Emite evento de actualización
↓
UI actualiza:
  - Badge en carrito
  - Cantidad items
  - Total visible
↓
Usuario navega a /checkout
↓
Frontend carga contexto de carrito
↓
Muestra resumen y formulario
↓
Usuario completa datos
↓
POST /orders con datos
↓
Backend procesa pago (integración con Stripe/PayPal)
↓
Si éxito:
  - Crear documento Order en DB
  - Enviar email confirmación
  - Retornar confirmationNumber
↓
Frontend:
  - Borra localStorage cart
  - Redirige a confirmación
↓
Usuario ve orden creada
```

---

## 💰 CÁLCULO DE TOTALES

### Fórmula Ejemplo

```
Subtotal = Producto1 (qty × precio) + Producto2 (qty × precio)
         = (2 × $12.99) + (1 × $14.99)
         = $25.98 + $14.99
         = $40.97

Impuestos = Subtotal × 10%
          = $40.97 × 0.10
          = $4.10 (aprox)

Envío = $2.00 (delivery normal)
        $0.00 (pickup)
        $5.00 (express)

TOTAL = Subtotal + Impuestos + Envío
      = $40.97 + $4.10 + $2.00
      = $47.07
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Agregar al carrito
```
1. En /menu, ver producto
2. Agregar al carrito (cantidad 2)
3. Ver badge en icono carrito (+2)
4. Agregar otro producto
5. Ver actualizarse (+3 total)
```

### Escenario 2: Ver carrito
```
1. Hacer clic en icono carrito
2. Navegar a /cart
3. Ver 2 productos con cantidades
4. Ver subtotal, impuestos, total
5. Mostrar que todo se sincroniza
```

### Escenario 3: Modificar cantidades
```
1. En /cart, aumentar cantidad de un producto
2. Ver total actualizado
3. Disminuir cantidad
4. Ver total bajado
5. Remover producto
6. Total cambia nuevamente
```

### Escenario 4: Checkout sin autenticación
```
1. En /cart con productos
2. Clic en "Proceder a Checkout"
3. Ir a /checkout
4. Ver formulario de datos (nombre, email, etc.)
5. Ver método envío y pago
6. Llenar formulario
7. Confirmar compra
```

### Escenario 5: Checkout autenticado
```
1. Login como cliente@prueba.com
2. Agregar productos a carrito
3. Ir a checkout
4. Ver datos pre-llenados (email, nombre)
5. Ver opción de editar
6. Confirmar compra
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "Carrito vacío" | No hay productos | Volver a /menu y agregar |
| "Producto no existe" | ID inválido en carrito | Limpiar localStorage |
| "Total incorrecto" | Error en cálculo | Verificar fórmula de impuestos |
| "No puedo comprar" | Carrito vacío | Debe tener al menos 1 producto |
| "Faltan datos" | Formulario incompleto | Llenar todos los campos requeridos |

---

## 🛡️ VALIDACIONES

### Antes de Crear Orden

```javascript
✓ Carrito no está vacío
✓ Total > 0
✓ Email válido (formato)
✓ Nombre no vacío
✓ Dirección completada (para delivery)
✓ Teléfono válido
✓ Método pago seleccionado
✓ Método envío seleccionado
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar /menu y agregar producto al carrito
- [ ] Ver badge actualizado en carrito
- [ ] Navegar a /cart
- [ ] Ver productos y totales
- [ ] Aumentar/disminuir cantidades
- [ ] Mostrar cálculo de total + impuestos + envío
- [ ] Ir a /checkout
- [ ] Si no autenticado: Mostrar formulario de datos
- [ ] Si autenticado: Mostrar datos pre-llenados
- [ ] Seleccionar método envío
- [ ] Seleccionar método pago
- [ ] NOTA: NO completar pago en demo (no hacer cargo real)

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Se guarda el carrito si cierro navegador?**  
A: Sí, está en localStorage. Se restaura si vuelvo.

**Q: ¿Puedo comprar sin crear cuenta?**  
A: Sí, puedo comprar como "invitado" con email.

**Q: ¿Cuánto cuesta el envío?**  
A: $2 normal, $5 express, gratis pickup en local.

**Q: ¿Qué pasa si me vas de /checkout?**  
A: El carrito se sigue guardando. Puedo volver.

---

## 🔗 RELACIONADO CON

- [Módulo 2: Menú](./02-MENU.md) - Agregar productos desde aquí
- [Módulo 4: Órdenes](./04-ORDERS.md) - La orden se crea desde checkout
- [Módulo 6: Pagos](./06-PAYMENTS.md) - Procesamiento de pago
- [Módulo 1: Autenticación](./01-AUTHENTICATION.md) - Datos pre-llenados si autenticado
