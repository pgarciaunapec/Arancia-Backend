/**
 * TASK 4: Gestión de Imágenes y Descarga de URLs
 * 
 * REQUISITO:
 * - Si admin proporciona URL externa, descargar imagen
 * - Guardar en Buffer/Base64 en BD
 * - No depender de enlaces externos
 * 
 * IMPLEMENTACIÓN:
 * 
 * 1. Backend Routes - POST /admin/items con imageUrl
 *    - Aceptar: imageUrl (string) o imageFile (multipart)
 *    - Si imageUrl: descargar con axios/node-fetch
 *    - Convertir a Buffer/Base64
 *    - Guardar en MenuItem.image como dataURL
 * 
 * 2. Middleware de Descarga:
 *    async function downloadImage(imageUrl: string): Promise<Buffer> {
 *      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
 *      return Buffer.from(response.data, 'binary');
 *    }
 * 
 * 3. Conversión a Base64:
 *    const base64 = buffer.toString('base64');
 *    const dataUrl = `data:image/jpeg;base64,${base64}`;
 * 
 * 4. Frontend - Muestra en <img src={menu.image} />
 *    (Ya soporta dataURL)
 * 
 * STATUS: Documentado - Requiere instalación axios
 */

/**
 * TASK 6: Seeding de Inventario y Flujo de Caja
 * 
 * REQUISITO:
 * - Seed robusto: Menu items + Inventory con ingredientes/utensilios
 * - Vista de Flujo de Caja en Admin
 * - Registrar entradas (pedidos) y salidas (gastos inventario)
 * 
 * IMPLEMENTACIÓN:
 * 
 * 1. Script Seed (scripts/seed-inventory.ts):
 *    - Crear 20+ platos con ingredientes y utensilios
 *    - Crear 50+ items de inventario (arroz, sal, etc.)
 *    - Crear trazabilidad de movimientos
 * 
 * 2. Modelo InventoryMovement (ya existe):
 *    - type: 'addition' | 'usage' | 'waste' | 'restock'
 *    - item: ref → InventoryItem
 *    - quantity: number
 *    - reference: orden o gasto
 *    - notes: descripción
 * 
 * 3. Flujo de Caja:
 *    POST /admin/cash-register/open-session
 *    - Registro de apertura con saldo inicial
 *    - Tracking de ingresos (pagos) y egresos (gastos inventario)
 *    - POST /admin/cash-register/:sessionId/close
 * 
 * 4. Dashboard:
 *    GET /admin/inventory/movements
 *    GET /admin/cash-register/summary
 * 
 * STATUS: Documentado - Requiere scripts seed + rutas dashboard
 */
