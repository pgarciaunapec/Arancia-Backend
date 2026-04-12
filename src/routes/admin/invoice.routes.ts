import { Router, Response } from "express";
import { Invoice } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import("express").Router = Router();

// @route   GET /api/admin/invoices
// @desc    List invoices
// @access  Admin/Staff
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page = "1", limit = "30", kind, code, userId } = req.query;
      const p = Math.max(parseInt(page as string, 10) || 1, 1);
      const l = Math.min(Math.max(parseInt(limit as string, 10) || 30, 1), 100);

      const query: Record<string, unknown> = {};
      if (kind) query.kind = kind;
      if (userId) query.user = userId;
      if (code) query.code = { $regex: String(code), $options: "i" };

      const total = await Invoice.countDocuments(query);
      const invoices = await Invoice.find(query)
        .populate("user", "name email")
        .populate("order", "_id status total")
        .populate("tableBill", "_id status total")
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l);

      res.json({
        success: true,
        data: invoices,
        pagination: {
          page: p,
          limit: l,
          total,
          pages: Math.ceil(total / l),
        },
      });
    } catch (error) {
      console.error("Admin get invoices error:", error);
      res.status(500).json({ error: "Error al obtener comprobantes" });
    }
  },
);

// @route   GET /api/admin/invoices/:id
// @desc    Get invoice by id
// @access  Admin/Staff
router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoice = await Invoice.findById(req.params.id)
        .populate("user", "name email")
        .populate("order", "_id status total")
        .populate("tableBill", "_id status total");

      if (!invoice) {
        res.status(404).json({ error: "Comprobante no encontrado" });
        return;
      }

      res.json({ success: true, data: invoice });
    } catch (error) {
      console.error("Admin get invoice error:", error);
      res.status(500).json({ error: "Error al obtener comprobante" });
    }
  },
);

export default router;
