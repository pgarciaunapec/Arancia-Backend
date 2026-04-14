# 🎛️ MÓDULO 8: PANEL ADMINISTRATIVO

**Para qué sirve:** Central de control del restaurante. Gestionar órdenes, mesas, productos, inventario, etc.

---

## 📋 ESTRUCTURA DEL PANEL ADMIN

El panel admin es un sistema completo con múltiples subsistemas:

```
PANEL ADMIN
├── Dashboard (inicio con KPIs)
├── Órdenes
│   ├── Ver todas
│   ├── Cambiar estado
│   └── Asignar repartidor
├── Clientes
│   ├── Base de datos de clientes
│   ├── Ver historial compras
│   └── Contacto
├── Productos/Menú
│   ├── CRUD de productos
│   ├── Categorías
│   ├── Precios
│   └── Disponibilidad
├── Mesas & Reservas
│   ├── Gestionar mesas
│   ├── Ver reservaciones
│   ├── Check-in
│   └── Check-out
├── Inventario
│   ├── Stock de productos
│   ├── Movimientos
│   ├── Alertas de bajo stock
│   └── Proveedores
├── Caja Registradora
│   ├── Abrir caja
│   ├── Ver transacciones
│   ├── Arqueo de caja
│   └── Arqueo de turno
├── Delivery
│   ├── Ver entregas
│   ├── Asignar repartidor
│   ├── Flota de repartidores
│   └── Reportes de entregas
├── Reportes & Analytics
│   ├── Ventas por período
│   ├── Productos más vendidos
│   ├── Clientes frecuentes
│   ├── Rentabilidad
│   └── Gráficos de tendencias
├── Auditoría
│   ├── Log de cambios
│   ├── Quién cambió qué
│   ├── Cuándo se hizo
│   └── Exportar auditoría
└── Configuración
    ├── Datos del restaurante
    ├── Horarios de apertura
    ├── Métodos de pago
    └── Usuarios del sistema
```

---

## 🖼️ VISTAS PRINCIPALES DEL ADMIN

### 1. DASHBOARD

**URL:** http://localhost:3000/admin/dashboard

```
+─────────────────────────────────────────+
│ ╔═══════════════════════════════════════╗ │
│ ║  📊 DASHBOARD ADMINISTRATIVO          ║ │
│ ╚═══════════════════════════════════════╝ │
│                                           │
│  KPIs (Tarjetas):                         │
│  ┌──────────┬──────────┬──────────┐       │
│  │ Ingresos │ Órdenes  │Reservas  │       │
│  │ Hoy      │ Pendientes│Pendientes        │
│  │ €2,345.67│    12    │     3    │       │
│  └──────────┴──────────┴──────────┘       │
│                                           │
│  Gráficos:                                │
│  - Ventas últimos 7 días (línea)          │
│  - Métodos de pago (pie chart)            │
│  - Top 5 productos (barras)               │
│  - Ocupación restaurante (gauge)          │
│                                           │
│  Actividad Reciente:                      │
│  - Últimas 5 órdenes                      │
│  - Últimas 5 reservas                     │
│  - Alertas de inventario                  │
└─────────────────────────────────────────┘
```

**Funciones:**
- Ver KPIs en tiempo real
- Gráficos de tendencias
- Alertas importantes
- Acceso rápido a módulos

---

### 2. GESTIÓN DE ÓRDENES

**URL:** http://localhost:3000/admin/orders

```
+──────────────────────────────────────────────────┐
│ Tabla de Órdenes                                 │
├──────────────────────────────────────────────────┤
│ ID    │ Cliente   │ Estado    │ Total │ Acción  │
├──────────────────────────────────────────────────┤
│ORD-1  │ Juan P.   │ pending   │€47.07│ Ver     │
│ORD-2  │ María G.  │confirmed  │€32.50│ Cambiar │
│ORD-3  │ Pedro L.  │preparing  │€28.99│ Asignar │
│ORD-4  │ Ana M.    │in_delivery│€55.00│ Entregar│
└──────────────────────────────────────────────────┘

Filtros:
- Por estado (pending, confirmed, etc.)
- Por fecha
- Por cliente
- Por método pago
- Por tipo (delivery, pickup)

Acciones:
- Ver detalles completos
- Cambiar estado (confirmar, enviar cocina, etc.)
- Asignar repartidor
- Imprimir recibo/etiqueta
- Refundar si es necesario
```

---

### 3. GESTIÓN DE PRODUCTOS

**URL:** http://localhost:3000/admin/collections

```
+────────────────────────────────────────────┐
│ Panel de Productos                         │
├────────────────────────────────────────────┤
│ [Crear Producto] [Importar] [Exportar]     │
│                                            │
│ Tabla:                                     │
│ Imagen │ Nombre │ Categoría │ Precio │... │
│ [IMG] │ Pizza M│ Pizzas   │ €12.99 │... │
│ [IMG] │ Pasta C│ Pastas   │ €14.99 │... │
│                                            │
│ Para cada producto:                        │
│ - Ver detalles                             │
│ - Editar (nombre, precio, imagen)          │
│ - Cambiar categoría                        │
│ - Activar/desactivar                       │
│ - Eliminar                                 │
└────────────────────────────────────────────┘
```

**Formulario Crear Producto:**
```
Nombre          [_________________]
Descripción     [_________________]
Categoría       [Dropdown]
Subcategoría    [Dropdown]
Precio          [_________________]
Imagen          [Upload]
Disponible      [Toggle]
Ingredientes    [Tag input]
Alérgenos       [Checkboxes]
Tiempo prep     [_____] minutos
Stock           [_________________]
```

---

### 4. GESTIÓN DE MESAS

**URL:** http://localhost:3000/admin/tables

```
+──────────────────────────────────────┐
│ Gestión de Mesas                     │
├──────────────────────────────────────┤
│                                      │
│  Plano del Restaurante:              │
│  ┌─────────────────────────────┐     │
│  │                             │     │
│  │  [5]  [6]  [7]             │     │
│  │        ●                    │     │
│  │  [3]  [4]  [8]             │     │
│  │  ●    ✓                     │     │
│  │  [1]  [2]                  │     │
│  │                             │     │
│  └─────────────────────────────┘     │
│                                      │
│  [5] = Libre      ✓ = Ocupada        │
│  ● = Reservada                       │
│                                      │
│  Leyenda tabla:                      │
│  Mesa │ Capacidad │ Estado │ Acción │
│───────┼───────────┼────────┼────────│
│  1    │     4     │ libre  │ Editar │
│  2    │     6     │ ocupada│ Check  │
│  3    │     2     │reserv. │ Cancelar│
└──────────────────────────────────────┘
```

---

### 5. INVENTARIO

**URL:** http://localhost:3000/admin/inventory

```
+──────────────────────────────────────────┐
│ Control de Inventario                    │
├──────────────────────────────────────────┤
│ Producto        │ Stock │ Mín │ Estado   │
├──────────────────────────────────────────┤
│ Tomates         │  25   │ 10  │ ✓ OK    │
│ Queso mozz.     │   3   │  5  │ ⚠ BAJO  │
│ Harina          │   0   │ 10  │ ❌ AGOTADO│
│ Aceitunas       │  50   │ 20  │ ✓ OK    │
└──────────────────────────────────────────┘

Funciones:
- Ver stock actual
- Alertas de bajo stock
- Historial de movimientos
- Agregar stock (compra)
- Remover stock (desperdicio)
- Ajustar inventario
- Gestionar proveedores
```

---

### 6. CAJA REGISTRADORA

**URL:** http://localhost:3000/admin/cashregister

```
Operaciones:
1. ABRIR CAJA
   - Monto inicial (ej: €100)
   - Responsable
   - Hora de apertura

2. VER TRANSACCIONES
   - Todas las ventas del turno
   - Pagos recibidos
   - Cambios realizados

3. ARQUEO DE CAJA
   - Dinero esperado
   - Dinero actual (contar físicamente)
   - Diferencia (faltante/sobrante)

4. CIERRE DE TURNO
   - Cuánto ganó turno
   - Depósito realizado
   - Hora de cierre
```

---

### 7. REPORTES & ANALYTICS

**URL:** http://localhost:3000/admin/reports

```
Reportes disponibles:

1. VENTAS
   - Por período (hoy, semana, mes, personalizado)
   - Por método de pago
   - Por categoría de producto
   - Gráfico de tendencias

2. PRODUCTOS
   - Más vendidos
   - Menos vendidos
   - Rentabilidad
   - Stock bajo

3. CLIENTES
   - Más frecuentes
   - Mayor gasto
   - Últimas compras
   - Tendencias

4. OPERATIVO
   - Tiempo promedio preparación
   - Tasa de entrega exitosa
   - Número de órdenes/hora
   - Ocupación restaurante

5. EXPORTAR
   - PDF
   - Excel
   - CSV
   - Email automático (schedulable)
```

---

### 8. AUDITORÍA

**URL:** http://localhost:3000/admin/audit

```
+──────────────────────────────────────┐
│ Log de Auditación                    │
├──────────────────────────────────────┤
│ Quién  │ Qué       │ Cuándo │ Cambio │
├──────────────────────────────────────┤
│ Carlos │ Editar    │14:30   │ Precio │
│        │ Precio    │        │ Pizza  │
│ María  │ Crear     │13:20   │ Nueva  │
│        │ Orden     │        │ Orden  │
│ Admin  │ Eliminar  │12:15   │ Usuario│
│        │ Usuario   │        │ Test   │
└──────────────────────────────────────┘

Filtros:
- Por usuario
- Por acción (crear, editar, eliminar)
- Por tipo objeto (orden, producto, etc.)
- Por fecha/hora
- Por resultado (éxito, error)

Exportar: PDF, CSV, Email
```

---

## 🔗 ENDPOINTS DEL ADMIN

```
Todos requieren:
- Auth: JWT token + Admin role

GET /admin/dashboard
- Response: KPIs, gráficos, alertas

GET /admin/orders
- Query: status, date, clientName
- Response: [ órdenes ]

PUT /admin/orders/:id/status
- Body: { status: "confirmed" }
- Response: { orden actualizada }

POST /admin/products
- Body: { name, price, image, ... }
- Response: { producto creado }

PUT /admin/products/:id
- Body: { campos a actualizar }

GET /admin/tables
- Response: [ mesas ]

POST /admin/inventory/adjust
- Body: { productId, quantity, reason }

GET /admin/reports/sales
- Query: startDate, endDate, groupBy
- Response: { datos reporte }

GET /admin/audit
- Response: [ log de auditoría ]
```

---

## 👥 ACCESO AL ADMIN

**Login especial para admin:**

```
URL: http://localhost:3000/admin/login

Credenciales:
Email: admin@prueba.com
Contraseña: Admin123!

Diferente del login cliente (/login)
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Subsistema |
|---------|-------------|-----------|
| **Dashboard** | Vista general + KPIs | Panel |
| **Manage Orders** | Ver + cambiar estado | Órdenes |
| **Manage Products** | CRUD completo | Productos |
| **Manage Tables** | CRUD mesas | Mesas |
| **Manage Inventory** | Stock + movimientos | Inventario |
| **Cash Register** | Abrir, arqueo, cierre | Caja |
| **Manage Delivery** | Asignar repartidores | Delivery |
| **Reports** | Análisis de datos | Reportes |
| **Audit Log** | Quién cambió qué | Auditoría |

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Ver Dashboard
```
1. Login como admin@prueba.com
2. Ir a /admin/dashboard
3. Mostrar KPIs (ingresos, órdenes, etc.)
4. Mostrar gráficos
5. Mostrar alertas importantes
```

### Escenario 2: Gestionar Órdenes
```
1. En admin, ir a /admin/orders
2. Ver tabla de todas las órdenes
3. Filtrar por estado (ej: pending)
4. Hacer clic en una orden
5. Ver detalles completos
6. Cambiar estado (ej: pending → confirmed)
7. Guardar
```

### Escenario 3: Gestionar Productos
```
1. En admin, ir a /admin/collections
2. Ver tabla de productos
3. Hacer clic "Crear Producto"
4. Llenar formulario
5. Subir imagen
6. Guardar
7. Ver producto en menú público (/menu)
```

### Escenario 4: Ver Reportes
```
1. En admin, ir a /admin/reports
2. Seleccionar "Ventas"
3. Elegir período (hoy, semana, mes)
4. Ver gráfico de ventas
5. Ver tabla de detalle
6. (Opcional) Exportar a PDF
```

---

## ✅ CHECKLIST PARA DEMO

- [ ] Login como admin (pantalla especial)
- [ ] Mostrar /admin/dashboard (KPIs, gráficos)
- [ ] Mostrar /admin/orders (gestión órdenes)
- [ ] Cambiar estado de una orden
- [ ] Mostrar /admin/collections (productos)
- [ ] (Opcional) Crear producto nuevo
- [ ] Mostrar /admin/tables (mesas)
- [ ] Mostrar /admin/inventory (stock)
- [ ] Mostrar /admin/reports (reportes)
- [ ] Mostrar /admin/audit (auditoría)
- [ ] Mencionar caja registradora y delivery

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Cómo acceder a admin?**  
A: URL especial /admin/login con credenciales admin.

**Q: ¿Panel diferente al cliente?**  
A: Sí, completamente diferente. Panel cliente para comprar, panel admin para gestionar.

**Q: ¿Quién puede ser admin?**  
A: Solo usuarios con role="admin" en BD.

**Q: ¿Se puede cambiar estado de orden?**  
A: Sí, siguiendo el flujo: pending → confirmed → preparing → ready → in_delivery → delivered.

**Q: ¿Se calculan ganancias automáticamente?**  
A: Sí, dashboard muestra ingresos en tiempo real.

---

## 🔗 RELACIONADO CON

- [Módulo 4: Órdenes](./04-ORDERS.md) - Gestión desde admin
- [Módulo 2: Menú](./02-MENU.md) - CRUD productos
- [Módulo 5: Reservas](./05-RESERVATIONS.md) - Gestión mesas
- [Módulo 7: Delivery](./07-DELIVERY.md) - Gestión repartidores
- [Módulo 6: Pagos](./06-PAYMENTS.md) - Reportes de pagos
