import { Router, Response } from "express";
import { Order, Table, User } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";
import { OrderService } from "../../services/order.service";

const router: import("express").Router = Router();

// @route   GET /api/admin/orders
// @desc    List all orders (admin)
// @access  Admin/Staff
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, page = "1", limit = "20" } = req.query;
      const query: Record<string, unknown> = { status: { $ne: "cart" } };
      if (status) query.status = status;

      const p = parseInt(page as string);
      const l = parseInt(limit as string);
      const total = await Order.countDocuments(query);

      const orders = await Order.find(query)
        .populate("user", "name email")
        .populate("assignedStaff", "name email")
        .populate("assignedTable", "number zone")
        .populate("assignedVehicle", "plate vehicleModel type status")
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l);

      res.json({
        success: true,
        data: orders,
        pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) },
      });
    } catch (error) {
      console.error("Admin get orders error:", error);
      res.status(500).json({ error: "Error al obtener órdenes" });
    }
  },
);

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin/Staff
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status, deliveryAgentId, vehicleId } = req.body;
      const validStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }

      const updated = await OrderService.updateStatus(req.params.id, {
        status,
        deliveryAgentId,
        vehicleId,
      });
      const order = await Order.findById(updated._id)
        .populate("user", "name email")
        .populate("assignedStaff", "name email")
        .populate("assignedTable", "number zone")
        .populate("assignedVehicle", "plate vehicleModel type status");

      if (!order) {
        res.status(404).json({ error: "Orden no encontrada" });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Error al actualizar estado" });
    }
  },
);

// @route   PATCH /api/admin/orders/:id/assignment
// @desc    Assign staff/table/notes to an order
// @access  Admin/Staff
router.patch(
  "/:id/assignment",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { staffId, tableId, notes } = req.body as {
        staffId?: string;
        tableId?: string;
        notes?: string;
      };

      if (!staffId && !tableId && notes === undefined) {
        res
          .status(400)
          .json({ error: "Debes enviar al menos un campo para asignar" });
        return;
      }

      if (staffId) {
        const staffUser = await User.findById(staffId).select("role").lean();
        if (
          !staffUser ||
          (staffUser.role !== "staff" && staffUser.role !== "admin")
        ) {
          res.status(400).json({ error: "El empleado asignado no es válido" });
          return;
        }
      }

      if (tableId) {
        const table = await Table.findById(tableId).select("_id").lean();
        if (!table) {
          res.status(400).json({ error: "La mesa asignada no existe" });
          return;
        }
      }

      const update: Record<string, unknown> = {};
      if (staffId !== undefined) update.assignedStaff = staffId || null;
      if (tableId !== undefined) update.assignedTable = tableId || null;
      if (notes !== undefined) update.assignmentNotes = notes;

      const order = await Order.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      })
        .populate("user", "name email")
        .populate("assignedStaff", "name email")
        .populate("assignedTable", "number zone")
        .populate("assignedVehicle", "plate vehicleModel type status");

      if (!order) {
        res.status(404).json({ error: "Orden no encontrada" });
        return;
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error("Update order assignment error:", error);
      res.status(500).json({ error: "Error al asignar orden" });
    }
  },
);

export default router;
