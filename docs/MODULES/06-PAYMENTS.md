# 💳 MÓDULO 6: PAGOS Y FACTURACIÓN

**Para qué sirve:** Procesar pagos de órdenes, generar facturas e invoices, controlar transacciones.

---

## 📋 FLUJO DE USUARIO

### 💰 Procesar Pago en Checkout

```
(Ver Módulo 3: Checkout completo)

Usuario en /checkout
↓
Selecciona método de pago:
  - Tarjeta de crédito/débito
  - PayPal
  - Transferencia bancaria
  - Efectivo a la entrega
↓
Si tarjeta: Redirige a Stripe (PCI compliant)
  - Ingresa datos tarjeta
  - 3D Secure (si aplica)
  - Confirmación
↓
Si PayPal: Redirige a PayPal
  - Login PayPal
  - Aprueba pago
  - Retorna a app
↓
Backend procesa pago
↓
Si éxito:
  - Crea orden
  - Genera factura
  - Carga en BD MongoDB
  - Envía email de confirmación
↓
Si falla:
  - Muestra error
  - Opción reintentar
  - Carrito se mantiene
```

### 📄 Generar Factura

```
Sistema genera automáticamente después de pago exitoso

Factura contiene:
  - Número de factura (FAC-2026-04-001)
  - Fecha de emisión
  - Cliente (nombre, email, dirección)
  - Items (producto, cantidad, precio unitario)
  - Subtotal
  - Impuestos (IVA, etc.)
  - Total
  - Método de pago
  - Código QR (rastreo)
  - Pie de página (T&C)

Cliente recibe en email:
  - Recibo de compra
  - PDF descargable
  - Número de orden y factura
```

### 📊 Admin Monitorea Transacciones

```
1. Admin accede a http://localhost:3000/admin/payments (si existe)
2. Ve dashboard con:
   - Total ingresos del día/mes
   - Métodos de pago más usados
   - Transacciones recientes
   - Gráficos de tendencias
3. Puede:
   - Filtrar por fecha/método
   - Buscar por número orden
   - Ver detalles de transacción
   - Descargar reporte
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Checkout** | `/checkout` | Selecciona método pago (parte de módulo 3) |
| **Confirmación** | `/booking-confirmation` | Confirmación con recibo |
| **Mis Facturas** | `/profile` (sección) | Historial de facturas en perfil |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Pagos** | `/admin/payments` (si existe) | Dashboard de transacciones |

---

## 🔗 ENDPOINTS DEL BACKEND

### Pagos Públicos

```
POST /payments/process
- Auth: JWT (opcional)
- Body: {
    orderId: "xxx",
    amount: 47.07,
    paymentMethod: "credit_card" | "paypal" | "cash" | "transfer",
    paymentToken: "stripe_token_xxx" // solo si tarjeta
  }
- Response: {
    success: true,
    transactionId: "trans_xxx",
    status: "completed"
  }
- Notas: Integración con Stripe/PayPal
- Estado: ✅ Implementado

GET /payments/:transactionId
- Response: { detalles transacción }
- Estado: ✅ Implementado

GET /invoices/:orderId
- Response: { PDF o JSON de factura }
- Estado: ✅ Implementado
```

### Admin (Reportes)

```
GET /admin/payments
- Auth: JWT + Admin
- Query: date, method, status
- Response: [ transacciones ]
- Estado: ✅ Implementado

GET /admin/payments/report
- Auth: JWT + Admin
- Query: startDate, endDate, format (pdf|excel|json)
- Response: Reporte descargable
- Estado: ✅ Implementado

PUT /admin/payments/:transactionId/refund
- Auth: JWT + Admin
- Body: { reason: "customer_request" }
- Response: { success, refundId }
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `payments`

```javascript
{
  _id: ObjectId,
  transactionId: "trans_2026_04_001",
  orderId: ObjectId,
  
  // Cliente
  userId: ObjectId | null,
  email: "cliente@email.com",
  
  // Monto
  amount: 47.07,
  currency: "EUR",
  taxAmount: 4.10,
  
  // Método
  paymentMethod: "credit_card" | "paypal" | "cash" | "transfer",
  
  // Details (según método)
  paymentDetails: {
    // Si tarjeta
    cardLast4: "4242",
    cardBrand: "VISA",
    stripeChargeId: "ch_xxx",
    
    // Si PayPal
    paypalTransactionId: "XXXXX",
    
    // Si transfer
    bankReference: "REF-xxx"
  },
  
  // Estado
  status: "pending" | "completed" | "failed" | "refunded",
  statusHistory: [
    { status: "pending", timestamp, note: "Procesando" },
    { status: "completed", timestamp, note: "Pagado" }
  ],
  
  // Factura
  invoiceId: ObjectId,
  invoiceGenerated: true,
  
  // Seguridad
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  
  timestamps
}
```

### Colección: `invoices`

```javascript
{
  _id: ObjectId,
  invoiceNumber: "FAC-2026-04-001",
  orderId: ObjectId,
  paymentId: ObjectId,
  
  // Empresa (datos del restaurante)
  company: {
    name: "Arancia Restaurant",
    address: "Calle Principal 123",
    city: "Madrid",
    zipCode: "28001",
    country: "Spain",
    taxId: "ES123456789",
    phone: "+34 912345678",
    email: "info@arancia.com"
  },
  
  // Cliente
  customer: {
    name: "Juan Perez",
    email: "juan@email.com",
    phone: "+34 912345678",
    address: "Calle Secundaria 456",
    city: "Madrid"
  },
  
  // Items
  items: [
    {
      description: "Pizza Margarita x2",
      quantity: 2,
      unitPrice: 12.99,
      totalPrice: 25.98
    }
  ],
  
  // Totales
  subtotal: 40.97,
  taxRate: 10,
  taxAmount: 4.10,
  totalAmount: 47.07,
  
  // Pago
  paymentMethod: "credit_card",
  paymentStatus: "completed",
  
  // Fechas
  issueDate: Date,
  dueDate: Date,
  
  // Notas
  notes: "Gracias por tu compra",
  termsAndConditions: "Válida por 5 años"
}
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Process Payment** | Procesar pago | Cliente | ✅ |
| **Verify Payment** | Verificar transacción | Backend (automático) | ✅ |
| **Generate Invoice** | Crear factura | Backend (automático) | ✅ |
| **Get Invoice** | Descargar factura | Owner/Admin | ✅ |
| **Refund Payment** | Reembolsar | Admin | ✅ |
| **Get Payment History** | Ver transacciones | Cliente/Admin | ✅ |
| **Get Payment Report** | Reporte de pagos | Admin | ✅ |
| **Webhook Stripe** | Confirmación Stripe | Backend (automático) | ✅ |

---

## 🔒 SEGURIDAD EN PAGOS

```
✓ PCI DSL Compliant (nunca guardar data tarjeta)
✓ Tokens de Stripe/PayPal (tokenización)
✓ HTTPS/SSL para todas las transacciones
✓ No logs de números tarjeta
✓ 3D Secure para transacciones de riesgo
✓ Validación de CVV
✓ IP whitelist (opcional)
✓ Detección de fraude (Stripe)
✓ Logs de auditoría
```

---

## 💳 MÉTODOS DE PAGO SOPORTADOS

| Método | Implementación | Estado | Notas |
|--------|---------------|--------|-------|
| **Tarjeta Crédito** | Stripe | ✅ | Visa, Mastercard, Amex |
| **PayPal** | PayPal API | ✅ | Segundaautenticación |
| **Transferencia** | Manual | ✅ | Confirmación posterior |
| **Efectivo** | En local | ✅ | Status: pending hasta confirmación |
| **Wallet Digital** | Apple Pay, Google Pay | ⏳ | Integración futura |

---

## 📊 FLUJO DE PAGO STRIPE

```
Cliente ingresa datos tarjeta en Stripe hosted form
↓
Stripe valida tarjeta
↓
Crea token de pago (nunca guardamos datos reales)
↓
Frontend envía token + monto a backend
↓
Backend verifica con Stripe
↓
Stripe carga el dinero
↓
Si éxito: Webhook notifica a backend
↓
Backend crea Order + Invoice
↓
Envía email de confirmación
↓
Cliente ve confirmación
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Pago con Tarjeta (Test)
```
1. Ir a /checkout con productos
2. Seleccionar "Tarjeta de Crédito"
3. Sistema redirige a Stripe
4. Usar tarjeta de prueba: 4242 4242 4242 4242
5. Expiry: 12/25
6. CVC: 123
7. Confirmar pago
8. Ver /booking-confirmation
9. Email de confirmación enviado
```

### Escenario 2: Ver factura
```
1. Luego de pago exitoso
2. En /booking-confirmation o email
3. Botón "Descargar Factura"
4. Se descarga PDF con:
   - Número factura
   - Items
   - Total
   - Datos cliente
```

### Escenario 3: Admin ve transacciones
```
1. Login como admin
2. Ir a /admin/payments (si existe)
3. Ver dashboard con:
   - Ingresos del día
   - Transacciones recientes
   - Métodos más usados
4. Filtrar por fecha
5. Ver detalles de transacción
```

### Escenario 4: Reembolso
```
1. Admin en /admin/payments (o detalle orden)
2. Botón "Reembolsar"
3. Ingresa motivo
4. Confirma
5. Sistema procesa refund
6. Cliente ve reembolso en 3-5 días
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "Tarjeta rechazada" | Fondos insuficientes | Usar otra tarjeta |
| "Pago pendiente" | Stripe aún procesando | Esperar 2-3 min |
| "Transacción duplicada" | Click doble | Esperar y refrescar |
| "Invoice no genera" | Error en backend | Contactar admin |
| "Webhook no llega" | Configuración Stripe | Verificar en dashboard Stripe |

---

## 💰 TASAS Y COMISIONES

```
Stripe:
- Tarjeta: 2.9% + €0.30 por transacción
- International: 3.9% + €0.30

PayPal:
- Doméstico: 3.49% + €0.49
- Internacional: 4.49% + €0.49

Transfer/Efectivo: Sin comisión
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar página /checkout
- [ ] Explicar diferentes métodos de pago
- [ ] Hacer "pago" con tarjeta de prueba
- [ ] NO completar transacción real (no cobrar)
- [ ] Mostrar /booking-confirmation
- [ ] Mostrar botón descargar factura
- [ ] Mostrar email de confirmación (mock)
- [ ] Explicar que factura se genera automáticamente
- [ ] (Opcional) Mostrar admin /admin/payments
- [ ] Explicar seguridad (PCI, tokens, etc.)

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Cuál es la tarjeta de prueba?**  
A: 4242 4242 4242 4242 (Stripe test mode)

**Q: ¿Se cobrará en demo?**  
A: NO, estamos en test mode. No hay dinero real.

**Q: ¿Cuándo recibo el dinero?**  
A: Stripe transfiere en 2-3 días a cuenta bancaria registrada.

**Q: ¿Qué pasa si pago falla?**  
A: Se muestra error, carrito se mantiene, puedo reintentar.

**Q: ¿Se puede hacer reembolso?**  
A: Sí, admin puede desde 2 horas hasta 90 días después.

---

## 🔗 RELACIONADO CON

- [Módulo 3: Carrito & Checkout](./03-CART-CHECKOUT.md) - Inicia desde checkout
- [Módulo 4: Órdenes](./04-ORDERS.md) - Se crea orden tras pago exitoso
- [Módulo 8: Admin](./08-ADMIN.md) - Gestión pagos desde panel
- [Módulo 9: Notificaciones](./09-CONTACT-NOTIFICATIONS.md) - Email de confirmación
