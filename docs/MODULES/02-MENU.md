# 🍽️ MÓDULO 2: MENÚ DE PRODUCTOS

**Para qué sirve:** Mostrar el catálogo de productos del restaurante, permitir búsqueda, filtrar por categoría.

---

## 📋 FLUJO DE USUARIO

### 👀 Cliente Explora el Menú

```
1. Usuario (autenticado o no) navega a http://localhost:3000/menu
2. Ve:
   - Todas las categorías (dropdown o sidebar)
   - Todos los productos disponibles en grid
   - Imagen, nombre, descripción y precio de cada producto
3. Puede:
   - Filtrar por categoría (Appetizers, Main Courses, Desserts, etc.)
   - Buscar producto por nombre
   - Ver detalles de producto
   - Agregar directamente al carrito
```

### 🔍 Búsqueda de Producto

```
1. En /menu, hay barra de búsqueda
2. Ingresa texto: "pizza", "pasta", etc.
3. Sistema busca en MongoDB
4. Filtra resultados en tiempo real
5. Muestra solo productos coincidentes
```

### 📂 Filtro por Categoría

```
1. En /menu, sidebar o dropdown con categorías
2. Usuario selecciona: "Pizzas"
3. Grid filtra solo pizzas
4. Muestra: cantidad de resultados
5. Puede deshacer filtro ("Ver todos")
```

### 📝 Ver Detalles Producto

```
1. Usuario hace clic en producto
2. Se abre modal o página con:
   - Imagen grande
   - Información completa
   - Ingredientes
   - Precio
   - Reseñas (si existen)
   - Botón "Agregar al Carrito"
3. Puede aumentar cantidad
4. Agrega al carrito
```

### 🎛️ Admin Gestiona Productos

```
1. Admin accede a /admin/dashboard
2. Va a sección de "Productos" o "Menú"
3. Puede:
   - Ver lista de todos los productos
   - Crear nuevo producto
   - Editar producto existente
   - Cambiar precio
   - Desactivar/eliminar producto
   - Ver inventario
```

---

## 🖼️ VISTAS / PÁGINAS

### Frontend - Cliente

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Menú** | `/menu` | Galería de productos con filtros |
| **Detalles Producto** | `/menu/:id` (Modal o Page) | Información detallada del producto |

### Frontend - Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Admin Menú** | `/admin/collections` | Ver/editar productos del menú |
| **Crear Producto** | `/admin/collections/create` | Formulario para agregar producto |
| **Editar Producto** | `/admin/collections/{id}/edit` | Formulario para editar |

---

## 🔗 ENDPOINTS DEL BACKEND

### Productos Públicos (Cualquiera puede acceder)

```
GET /menu
- Query params:
  - category: "pizzas" (opcional)
  - skip: 0 (paginación)
  - limit: 10 (items por página)
- Response: [ { id, name, price, image, category,... } ]
- Estado: ✅ Implementado

GET /menu/categories
- Response: [ "Pizzas", "Pastas", "Ensaladas",... ]
- Obtiene: lista de todas las categorías
- Estado: ✅ Implementado

GET /menu/search/:query
- Params: query = "pizza"
- Response: [ { productos coincidentes } ]
- Busca en: nombre, descripción, ingredientes
- Estado: ✅ Implementado

GET /menu/:id
- Params: id = MongoDB ObjectId
- Response: { producto completo con detalles }
- Estado: ✅ Implementado
```

### Productos Admin (Requiere autenticación + rol admin)

```
POST /menu
- Auth: JWT + Admin role
- Body: {
    name: "Pizza Margarita",
    description: "Tomate, mozzarella, albahaca",
    price: 12.99,
    category: "pizzas",
    image: "url_image",
    available: true,
    prepTime: 15
  }
- Response: { producto creado }
- Estado: ✅ Implementado

PUT /menu/:id
- Auth: JWT + Admin role
- Body: { campos a actualizar }
- Response: { producto actualizado }
- Estado: ✅ Implementado

DELETE /menu/:id
- Auth: JWT + Admin role
- Response: { message: "Producto eliminado" }
- Estado: ✅ Implementado
```

---

## 💾 DATOS EN BASE DE DATOS

### Colección: `menuitems`

```javascript
{
  _id: ObjectId,
  name: "Pasta Carbonara",
  description: "Pasta con huevo, queso y panceta",
  price: 14.99,
  category: "pastas",
  subcategory: "tradicionales",
  image: "url_imagen_producto",
  images: [ "url1", "url2", "url3" ],  // Múltiples imágenes
  available: true,
  ingredients: [ "pasta", "huevo", "queso", "panceta" ],
  allergens: [ "gluten", "huevo", "lácteos" ],
  prepTime: 12,                    // minutos
  calories: 550,
  vegetarian: false,
  vegan: false,
  rating: 4.5,
  reviews: 42,
  stock: 50,                       // Para inventario
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Colección: `categories` (opcional)

```javascript
{
  _id: ObjectId,
  name: "Pizzas",
  description: "Nuestras deliciosas pizzas",
  icon: "🍕",
  order: 1,              // Para ordenar en menú
  color: "#FF6B6B"
}
```

---

## 🎯 FUNCIONES PRINCIPALES

| Función | Descripción | Acceso | Estado |
|---------|-------------|--------|--------|
| **Obtener todos** | Lista todos productos | Público | ✅ |
| **Obtener categorías** | Lista categorías | Público | ✅ |
| **Buscar** | Búsqueda por texto | Público | ✅ |
| **Filtrar** | Por categoría | Público | ✅ |
| **Ver detalles** | Producto individual | Público | ✅ |
| **Crear producto** | Nuevo producto | Admin | ✅ |
| **Editar producto** | Actualizar datos | Admin | ✅ |
| **Eliminar producto** | Remover del menú | Admin | ✅ |
| **Toggle disponible** | Activar/desactivar | Admin | ✅ |

---

## 👥 ROLES Y ACCESO

| Rol | Puede Ver | Puede Crear | Puede Editar | Puede Eliminar |
|-----|-----------|------------|-------------|----------------|
| **Público (sin login)** | Sí, todo | ❌ | ❌ | ❌ |
| **Cliente** | Sí, todo | ❌ | ❌ | ❌ |
| **Admin** | Sí, todo | ✅ | ✅ | ✅ |
| **Delivery** | Sí (solo items) | ❌ | ❌ | ❌ |

---

## 🏗️ FLUJO TÉCNICO

```
Usuario accede a /menu
↓
Frontend hace GET /menu
↓
Backend:
  1. Query MongoDB colección menuitems
  2. Aplica filtros (category, search, pagination)
  3. Devuelve array de productos
↓
Frontend renderiza:
  1. Lista de categorías
  2. Grid de productos
  3. Barra de búsqueda
↓
Usuario filtra o busca
↓
Frontend emite query actualizado
↓
Backend retorna productos filtrados
↓
Frontend actualiza grid
```

---

## 🧪 PRUEBA RÁPIDA (Para Presentador)

### Escenario 1: Ver menú completo
```
1. Ir a http://localhost:3000/menu
2. Ver todos los productos cargados
3. Notar categorías disponibles
4. Ver que cada producto tiene imagen, nombre, precio
```

### Escenario 2: Filtrar por categoría
```
1. En /menu, seleccionar categoría (ej: "Pizzas")
2. Grid filtra solo pizzas
3. Mostrar resultado diferente
4. Deshacer filtro
```

### Escenario 3: Buscar producto
```
1. En /menu, usar barra de búsqueda
2. Escribir: "mar" (margarita)
3. Ver solo productos con "mar"
4. Borrar búsqueda
```

### Escenario 4: Ver detalles
```
1. En /menu, hacer clic en un producto
2. Ver información completa
3. Ver botón "Agregar al Carrito"
4. Aumentar cantidad
5. Agregar al carrito (ir a módulo 3)
```

### Escenario 5: Admin crea nuevo producto
```
1. Login como admin
2. Ir a /admin/collections
3. Botón "Crear Producto"
4. Llenar formulario
5. Guardar
6. Ver en /menu (refrescar)
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| "No hay productos" | Menú vacío en DB | Crear productos desde admin |
| "Imagen no carga" | URL rota | Verificar URL en producto |
| "Búsqueda no funciona" | Índices no configurados | Crear índice MongoDB en name |
| "Filtro lento" | Muchos productos sin índice | Indexar categoría |

---

## 📋 CATEGORÍAS TÍPICAS

- 🥗 Ensaladas
- 🍕 Pizzas
- 🍝 Pastas
- 🍔 Hamburguesas
- 🌮 Tacos
- 🍜 Sopas
- 🥘 Platos Principales
- 🍰 Postres
- 🥤 Bebidas
- 🍦 Helados

---

## ✅ CHECKLIST PARA DEMO

- [ ] Mostrar página /menu con todos los productos
- [ ] Explicar categorías disponibles
- [ ] Hacer búsqueda de producto
- [ ] Filtrar por categoría
- [ ] Hacer clic en producto para ver detalles
- [ ] Mencionar que cada producto tiene imagen
- [ ] Explicar que admin puede crear/editar productos
- [ ] Mostrar panel admin /admin/collections
- [ ] Crear nuevo producto (si es posible)
- [ ] Refrescar /menu para ver producto nuevo

---

## 📞 INFORMACIÓN IMPORTANTE

**Q: ¿Cuántos productos puede haber?**  
A: Sin límite técnico. Se recomienda paginación para UI.

**Q: ¿Se pueden tener múltiples imágenes por producto?**  
A: Sí, el modelo soporta array de imágenes.

**Q: ¿Cómo se ordena el menú?**  
A: Por categoría. Dentro de cada categoría por timestamp (más recientes primero).

**Q: ¿Se puede cambiar el precio sin crear nuevo producto?**  
A: Sí, el admin puede editar solo el precio.

---

## 🔗 RELACIONADO CON

- [Módulo 1: Autenticación](./01-AUTHENTICATION.md) - Admin login
- [Módulo 3: Carrito](./03-CART-CHECKOUT.md) - Agregar a carrito desde menú
- [Módulo 6: Pagos](./06-PAYMENTS.md) - Los precios aquí se usan en checkout
- [Módulo 8: Admin](./08-ADMIN.md) - Gestión de productos desde panel
