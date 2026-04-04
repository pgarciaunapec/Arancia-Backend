import { Router, Response } from "express";
import { DeliveryOrder } from "../models/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";
import { DeliveryService } from "../services/delivery.service";

const router: import("express").Router = Router();

// @route   GET /api/delivery/active
// @desc    Get active delivery for current user
// @access  Private
router.get(
  "/active",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const delivery = await DeliveryService.getClientActiveDelivery(
        req.user!.id,
      );

      res.json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      console.error("Get active delivery error:", error);
      res.status(500).json({ error: "Error al obtener delivery" });
    }
  },
);

// @route   GET /api/delivery/:orderId
// @desc    Get delivery by order id
// @access  Private
router.get(
  "/:orderId",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const delivery = await DeliveryOrder.findOne({
        order: req.params.orderId,
        user: req.user!.id,
      }).populate("order", "total items status");

      if (!delivery) {
        res.status(404).json({ error: "Delivery no encontrado" });
        return;
      }

      res.json({
        success: true,
        data: delivery,
      });
    } catch (error) {
      console.error("Get delivery error:", error);
      res.status(500).json({ error: "Error al obtener delivery" });
    }
  },
);

export default router;
