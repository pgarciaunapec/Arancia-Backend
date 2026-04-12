import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { InventoryItem, InventoryMovement } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import("express").Router = Router();

// @route   GET /api/admin/inventory
// @desc    List inventory items
// @access  Admin
router.get(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { category, search, lowStock } = req.query;
      const query: Record<string, unknown> = { isActive: true };

      if (category) query.category = category;
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      let items = await InventoryItem.find(query).sort({ name: 1 });

      if (lowStock === "true") {
        items = items.filter((item) => item.isLowStock);
      }

      const lowStockCount = items.filter((item) => item.isLowStock).length;

      res.json({
        success: true,
        data: items,
        lowStockCount,
      });
    } catch (error) {
      console.error("Get inventory error:", error);
      res.status(500).json({ error: "Error al obtener inventario" });
    }
  },
);

// @route   GET /api/admin/inventory/movements
// @desc    Get inventory movement history (optional item filter)
// @access  Admin
router.get(
  "/movements",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { itemId, limit = "100" } = req.query;
      const parsedLimit = Math.min(
        Math.max(parseInt(limit as string) || 100, 1),
        300,
      );

      const query: Record<string, unknown> = {};
      if (itemId) {
        query.item = itemId;
      }

      const movements = await InventoryMovement.find(query)
        .populate("item", "name category unit")
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(parsedLimit);

      res.json({ success: true, data: movements });
    } catch (error) {
      console.error("Get inventory movements error:", error);
      res.status(500).json({ error: "Error al obtener trazabilidad" });
    }
  },
);

// @route   GET /api/admin/inventory/:id/movements
// @desc    Get movement history for one inventory item
// @access  Admin
router.get(
  "/:id/movements",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const movements = await InventoryMovement.find({ item: req.params.id })
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(200);

      res.json({ success: true, data: movements });
    } catch (error) {
      console.error("Get item movements error:", error);
      res.status(500).json({ error: "Error al obtener historial del item" });
    }
  },
);

// @route   POST /api/admin/inventory
// @desc    Create inventory item
// @access  Admin
router.post(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("name").trim().notEmpty().withMessage("Nombre requerido"),
    body("category").trim().notEmpty().withMessage("Categoría requerida"),
    body("currentStock")
      .isFloat({ min: 0 })
      .withMessage("Stock actual requerido"),
    body("minimumStock")
      .isFloat({ min: 0 })
      .withMessage("Stock mínimo requerido"),
    body("unit").trim().notEmpty().withMessage("Unidad requerida"),
    body("costPerUnit").isFloat({ min: 0 }).withMessage("Costo requerido"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const item = await InventoryItem.create(req.body);

      await InventoryMovement.create({
        item: item._id,
        action: "create",
        quantity: Number(item.currentStock || 0),
        previousStock: 0,
        newStock: Number(item.currentStock || 0),
        reason: "Creación de ítem de inventario",
        performedBy: req.user?.id,
      });

      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error("Create inventory error:", error);
      res.status(500).json({ error: "Error al crear ítem" });
    }
  },
);

// @route   PUT /api/admin/inventory/:id
// @desc    Update inventory item
// @access  Admin
router.put(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await InventoryItem.findById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Ítem no encontrado" });
        return;
      }

      const previousStock = Number(existing.currentStock || 0);

      const item = await InventoryItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!item) {
        res.status(404).json({ error: "Ítem no encontrado" });
        return;
      }

      const newStock = Number(item.currentStock || 0);
      if (newStock !== previousStock) {
        await InventoryMovement.create({
          item: item._id,
          action: newStock > previousStock ? "adjustment_in" : "adjustment_out",
          quantity: Math.abs(newStock - previousStock),
          previousStock,
          newStock,
          reason: req.body.reason || "Ajuste manual de inventario",
          performedBy: req.user?.id,
        });
      }

      res.json({ success: true, data: item });
    } catch (error) {
      console.error("Update inventory error:", error);
      res.status(500).json({ error: "Error al actualizar ítem" });
    }
  },
);

// @route   PATCH /api/admin/inventory/:id/restock
// @desc    Restock an item
// @access  Admin
router.patch(
  "/:id/restock",
  authMiddleware,
  requireRole(["admin"]),
  [body("quantity").isFloat({ min: 0.1 }).withMessage("Cantidad requerida")],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const item = await InventoryItem.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Ítem no encontrado" });
        return;
      }

      const previousStock = Number(item.currentStock || 0);
      item.currentStock += req.body.quantity;
      item.lastRestocked = new Date();
      await item.save();

      await InventoryMovement.create({
        item: item._id,
        action: "restock",
        quantity: Number(req.body.quantity || 0),
        previousStock,
        newStock: Number(item.currentStock || 0),
        reason: req.body.reason || "Reabastecimiento",
        performedBy: req.user?.id,
      });

      res.json({ success: true, data: item, message: "Stock actualizado" });
    } catch (error) {
      console.error("Restock error:", error);
      res.status(500).json({ error: "Error al reabastecer" });
    }
  },
);

// @route   DELETE /api/admin/inventory/:id
// @desc    Soft delete inventory item
// @access  Admin
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const existing = await InventoryItem.findById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Ítem no encontrado" });
        return;
      }

      const item = await InventoryItem.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true },
      );

      if (!item) {
        res.status(404).json({ error: "Ítem no encontrado" });
        return;
      }

      await InventoryMovement.create({
        item: item._id,
        action: "deactivate",
        quantity: 0,
        previousStock: Number(existing.currentStock || 0),
        newStock: Number(item.currentStock || 0),
        reason: "Desactivación de ítem",
        performedBy: req.user?.id,
      });

      res.json({ success: true, message: "Ítem eliminado" });
    } catch (error) {
      console.error("Delete inventory error:", error);
      res.status(500).json({ error: "Error al eliminar ítem" });
    }
  },
);

// @route   GET /api/admin/inventory/alerts
// @desc    Get low stock alerts
// @access  Admin
router.get(
  "/alerts",
  authMiddleware,
  requireRole(["admin"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const items = await InventoryItem.find({ isActive: true });
      const alerts = items.filter((item) => item.isLowStock);

      res.json({ success: true, data: alerts, count: alerts.length });
    } catch (error) {
      console.error("Get alerts error:", error);
      res.status(500).json({ error: "Error al obtener alertas" });
    }
  },
);

export default router;
