import { Router, Response } from "express";
import { Order } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import('express').Router = Router();

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
      const { status } = req.body;
      const validStatuses = [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      ).populate("user", "name email");

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

export default router;
