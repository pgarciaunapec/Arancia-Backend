import { Router, Response } from "express";
import { Invoice } from "../models/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";

const router: import("express").Router = Router();

// @route   GET /api/invoices/my
// @desc    Get current user invoices
// @access  Private
router.get(
  "/my",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const invoices = await Invoice.find({ user: req.user!.id })
        .populate("order", "_id status total")
        .populate("tableBill", "_id status total")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: invoices });
    } catch (error) {
      console.error("Get my invoices error:", error);
      res.status(500).json({ error: "Error al obtener comprobantes" });
    }
  },
);

// @route   GET /api/invoices/order/:orderId
// @desc    Get invoice by order id
// @access  Private
router.get(
  "/order/:orderId",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query: Record<string, unknown> = { order: req.params.orderId };
      if (req.user?.role !== "admin" && req.user?.role !== "staff") {
        query.user = req.user!.id;
      }

      const invoice = await Invoice.findOne(query)
        .populate("order", "_id status total")
        .populate("tableBill", "_id status total");

      if (!invoice) {
        res.status(404).json({ error: "Comprobante no encontrado" });
        return;
      }

      res.json({ success: true, data: invoice });
    } catch (error) {
      console.error("Get order invoice error:", error);
      res.status(500).json({ error: "Error al obtener comprobante" });
    }
  },
);

// @route   GET /api/invoices/:id
// @desc    Get invoice by id
// @access  Private
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query: Record<string, unknown> = { _id: req.params.id };
      if (req.user?.role !== "admin" && req.user?.role !== "staff") {
        query.user = req.user!.id;
      }

      const invoice = await Invoice.findOne(query)
        .populate("order", "_id status total")
        .populate("tableBill", "_id status total");

      if (!invoice) {
        res.status(404).json({ error: "Comprobante no encontrado" });
        return;
      }

      res.json({ success: true, data: invoice });
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({ error: "Error al obtener comprobante" });
    }
  },
);

export default router;
