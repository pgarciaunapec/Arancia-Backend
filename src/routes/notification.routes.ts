import { Router, Response } from "express";
import { Notification } from "../models/Notification";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";

const router: import("express").Router = Router();

router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { unread = "false", limit = "20" } = req.query;
      const parsedLimit = Math.min(Math.max(parseInt(limit as string) || 20, 1), 100);

      const query: Record<string, unknown> = {
        user: req.user!.id,
      };

      if (unread === "true") {
        query.isRead = false;
      }

      const [notifications, unreadCount] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .limit(parsedLimit)
          .populate("order", "status total createdAt"),
        Notification.countDocuments({ user: req.user!.id, isRead: false }),
      ]);

      res.json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Error al obtener notificaciones" });
    }
  },
);

router.patch(
  "/read-all",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await Notification.updateMany(
        { user: req.user!.id, isRead: false },
        { isRead: true, readAt: new Date() },
      );

      res.json({
        success: true,
        data: { marked: result.modifiedCount || 0 },
      });
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      res.status(500).json({ error: "Error al marcar notificaciones" });
    }
  },
);

router.patch(
  "/:id/read",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user!.id },
        { isRead: true, readAt: new Date() },
        { new: true },
      );

      if (!notification) {
        res.status(404).json({ error: "Notificación no encontrada" });
        return;
      }

      res.json({ success: true, data: notification });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ error: "Error al actualizar notificación" });
    }
  },
);

export default router;
