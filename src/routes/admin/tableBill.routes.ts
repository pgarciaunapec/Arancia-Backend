import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { TableBill, Table, MenuItem } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import('express').Router = Router();

// @route   POST /api/admin/table-bills
// @desc    Open a new bill for a table
// @access  Admin/Staff
router.post(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [body("tableId").notEmpty().withMessage("Mesa requerida")],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { tableId, customerId } = req.body;

      const table = await Table.findById(tableId);
      if (!table) {
        res.status(404).json({ error: "Mesa no encontrada" });
        return;
      }

      if (table.activeBill) {
        res.status(400).json({ error: "La mesa ya tiene una cuenta abierta" });
        return;
      }

      const bill = await TableBill.create({
        table: tableId,
        waiter: req.user!.id,
        customer: customerId || undefined,
      });

      table.status = "occupied";
      table.activeBill = bill._id;
      await table.save();

      res.status(201).json({ success: true, data: bill });
    } catch (error) {
      console.error("Create bill error:", error);
      res.status(500).json({ error: "Error al crear cuenta" });
    }
  },
);

// @route   GET /api/admin/table-bills/:id
// @desc    Get bill detail
// @access  Admin/Staff
router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const bill = await TableBill.findById(req.params.id)
        .populate("table", "number zone")
        .populate("waiter", "name")
        .populate("customer", "name email isVip vipDiscount");

      if (!bill) {
        res.status(404).json({ error: "Cuenta no encontrada" });
        return;
      }

      res.json({ success: true, data: bill });
    } catch (error) {
      console.error("Get bill error:", error);
      res.status(500).json({ error: "Error al obtener cuenta" });
    }
  },
);

// @route   POST /api/admin/table-bills/:id/items
// @desc    Add items to bill
// @access  Admin/Staff
router.post(
  "/:id/items",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [body("menuItemId").notEmpty(), body("quantity").isInt({ min: 1 })],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const bill = await TableBill.findById(req.params.id);
      if (!bill || bill.status !== "open") {
        res.status(400).json({ error: "Cuenta no disponible" });
        return;
      }

      const menuItem = await MenuItem.findById(req.body.menuItemId);
      if (!menuItem) {
        res.status(404).json({ error: "Ítem de menú no encontrado" });
        return;
      }

      const existingIdx = bill.items.findIndex(
        (i) => i.menuItem.toString() === req.body.menuItemId,
      );

      if (existingIdx > -1) {
        bill.items[existingIdx].quantity += req.body.quantity;
      } else {
        bill.items.push({
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: req.body.quantity,
          price: menuItem.price,
        });
      }

      await bill.save();
      res.json({ success: true, data: bill });
    } catch (error) {
      console.error("Add item error:", error);
      res.status(500).json({ error: "Error al agregar ítem" });
    }
  },
);

// @route   DELETE /api/admin/table-bills/:id/items/:menuItemId
// @desc    Remove item from bill
// @access  Admin/Staff
router.delete(
  "/:id/items/:menuItemId",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const bill = await TableBill.findById(req.params.id);
      if (!bill || bill.status !== "open") {
        res.status(400).json({ error: "Cuenta no disponible" });
        return;
      }

      bill.items = bill.items.filter(
        (i) => i.menuItem.toString() !== req.params.menuItemId,
      );

      await bill.save();
      res.json({ success: true, data: bill });
    } catch (error) {
      console.error("Remove item error:", error);
      res.status(500).json({ error: "Error al eliminar ítem" });
    }
  },
);

// @route   PATCH /api/admin/table-bills/:id/discount
// @desc    Apply discount to bill
// @access  Admin/Staff
router.patch(
  "/:id/discount",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [body("discount").isFloat({ min: 0 })],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const bill = await TableBill.findById(req.params.id);
      if (!bill || bill.status !== "open") {
        res.status(400).json({ error: "Cuenta no disponible" });
        return;
      }

      bill.discount = req.body.discount;
      await bill.save();
      res.json({ success: true, data: bill });
    } catch (error) {
      console.error("Apply discount error:", error);
      res.status(500).json({ error: "Error al aplicar descuento" });
    }
  },
);

// @route   POST /api/admin/table-bills/:id/close
// @desc    Close and pay bill
// @access  Admin/Staff
router.post(
  "/:id/close",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [
    body("paymentMethod")
      .isIn(["cash", "card", "transfer"])
      .withMessage("Método de pago requerido"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const bill = await TableBill.findById(req.params.id);
      if (!bill || bill.status !== "open") {
        res.status(400).json({ error: "Cuenta no disponible para cierre" });
        return;
      }

      bill.status = "closed";
      bill.paymentMethod = req.body.paymentMethod;
      bill.paidAt = new Date();
      await bill.save();

      // Free the table
      await Table.findByIdAndUpdate(bill.table, {
        status: "available",
        activeBill: null,
      });

      res.json({
        success: true,
        data: bill,
        message: "Cuenta cerrada exitosamente",
      });
    } catch (error) {
      console.error("Close bill error:", error);
      res.status(500).json({ error: "Error al cerrar cuenta" });
    }
  },
);

export default router;
