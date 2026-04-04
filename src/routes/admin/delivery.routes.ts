import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { DeliveryOrder } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";
import { DeliveryService } from "../../services/delivery.service";

const router: import('express').Router = Router();

// @route   GET /api/admin/delivery
// @desc    List all active deliveries
// @access  Admin/Staff
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.query;
      const query: Record<string, unknown> = {};
      if (status) {
        query.status = status;
      } else {
        query.status = { $in: ["pending", "assigned", "in_transit"] };
      }

      const deliveries = await DeliveryOrder.find(query)
        .populate("order", "total items status")
        .populate("user", "name email phone")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: deliveries });
    } catch (error) {
      console.error("Admin get deliveries error:", error);
      res.status(500).json({ error: "Error al obtener deliveries" });
    }
  },
);

// @route   PATCH /api/admin/delivery/:id/status
// @desc    Update delivery status
// @access  Admin/Staff
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [
    body("status").isIn([
      "pending",
      "assigned",
      "in_transit",
      "delivered",
      "failed",
    ]),
    body("agentName").optional().isString(),
    body("agentPhone").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { status, agentName, agentPhone } = req.body;
      const agentInfo =
        agentName && agentPhone
          ? { name: agentName, phone: agentPhone }
          : undefined;

      const delivery = await DeliveryService.updateStatus(
        req.params.id,
        status,
        agentInfo,
      );

      if (!delivery) {
        res.status(404).json({ error: "Delivery no encontrado" });
        return;
      }

      res.json({ success: true, data: delivery });
    } catch (error) {
      console.error("Update delivery status error:", error);
      res.status(500).json({ error: "Error al actualizar delivery" });
    }
  },
);

export default router;
