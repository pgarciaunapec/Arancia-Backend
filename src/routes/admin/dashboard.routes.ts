import { Router, Response } from "express";
import {
  User,
  Order,
  Reservation,
  Payment,
  DeliveryOrder,
  Table,
} from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import('express').Router = Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
// @access  Admin/Staff
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [
        totalUsers,
        totalOrders,
        pendingOrders,
        todayOrders,
        todayReservations,
        todayRevenue,
        activeDeliveries,
        tables,
      ] = await Promise.all([
        User.countDocuments({ isActive: { $ne: false } }),
        Order.countDocuments({ status: { $ne: "cart" } }),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({
          status: { $ne: "cart" },
          createdAt: { $gte: today, $lte: endOfDay },
        }),
        Reservation.countDocuments({
          date: { $gte: today, $lte: endOfDay },
        }),
        Payment.aggregate([
          {
            $match: {
              status: "completed",
              createdAt: { $gte: today, $lte: endOfDay },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        DeliveryOrder.countDocuments({
          status: { $in: ["pending", "assigned", "in_transit"] },
        }),
        Table.find().lean(),
      ]);

      const occupiedTables = tables.filter(
        (t) => t.status === "occupied",
      ).length;
      const totalTables = tables.length;

      res.json({
        success: true,
        data: {
          totalUsers,
          totalOrders,
          pendingOrders,
          todayOrders,
          todayReservations,
          todayRevenue: todayRevenue[0]?.total || 0,
          activeDeliveries,
          occupiedTables,
          totalTables,
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Error al obtener dashboard" });
    }
  },
);

export default router;
