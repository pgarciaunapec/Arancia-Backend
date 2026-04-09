import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { CashRegister, TableBill, Payment } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import('express').Router = Router();

const getStartOfDay = (date: Date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date: Date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// @route   GET /api/admin/cash-register/today
// @desc    Get today's cash register
// @access  Admin/Staff
router.get(
  "/today",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const today = getStartOfDay();
      const register = await CashRegister.findOne({
        date: { $gte: today, $lte: getEndOfDay() },
      })
        .populate("openedBy", "name")
        .populate("closedBy", "name");

      res.json({ success: true, data: register });
    } catch (error) {
      console.error("Get today register error:", error);
      res.status(500).json({ error: "Error al obtener caja" });
    }
  },
);

// @route   POST /api/admin/cash-register/open
// @desc    Open cash register
// @access  Admin/Staff
router.post(
  "/open",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [
    body("openingBalance")
      .isFloat({ min: 0 })
      .withMessage("Saldo de apertura requerido"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const today = getStartOfDay();
      const existing = await CashRegister.findOne({
        date: { $gte: today, $lte: getEndOfDay() },
        status: "open",
      });

      if (existing) {
        res.status(400).json({ error: "Ya hay una caja abierta hoy" });
        return;
      }

      const register = await CashRegister.create({
        date: today,
        openingBalance: req.body.openingBalance,
        openedBy: req.user!.id,
        notes: req.body.notes,
      });

      res.status(201).json({ success: true, data: register });
    } catch (error) {
      console.error("Open register error:", error);
      res.status(500).json({ error: "Error al abrir caja" });
    }
  },
);

// @route   POST /api/admin/cash-register/close
// @desc    Close cash register with summary
// @access  Admin/Staff
router.post(
  "/close",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const today = getStartOfDay();
      const register = await CashRegister.findOne({
        date: { $gte: today, $lte: getEndOfDay() },
        status: "open",
      });

      if (!register) {
        res.status(400).json({ error: "No hay caja abierta para cerrar" });
        return;
      }

      // Aggregate table bills for today
      const tableBillAgg = await TableBill.aggregate([
        {
          $match: {
            status: "closed",
            paidAt: { $gte: today, $lte: getEndOfDay() },
          },
        },
        {
          $group: {
            _id: "$paymentMethod",
            total: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Aggregate online payments for today
      const paymentAgg = await Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: today, $lte: getEndOfDay() },
          },
        },
        {
          $group: {
            _id: "$method",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      let totalSales = 0;
      let totalCash = 0;
      let totalCard = 0;
      let totalTransfer = 0;
      let transactionCount = 0;

      [...tableBillAgg, ...paymentAgg].forEach((agg) => {
        totalSales += agg.total;
        transactionCount += agg.count;
        if (agg._id === "cash") totalCash += agg.total;
        if (agg._id === "card") totalCard += agg.total;
        if (agg._id === "transfer") totalTransfer += agg.total;
      });

      register.status = "closed";
      register.closedBy = req.user!.id as any;
      register.totalSales = totalSales;
      register.totalCash = totalCash;
      register.totalCard = totalCard;
      register.totalTransfer = totalTransfer;
      register.transactionCount = transactionCount;
      register.closingBalance = register.openingBalance + totalCash;
      register.notes = req.body.notes || register.notes;
      await register.save();

      res.json({
        success: true,
        data: register,
        message: "Caja cerrada exitosamente",
      });
    } catch (error) {
      console.error("Close register error:", error);
      res.status(500).json({ error: "Error al cerrar caja" });
    }
  },
);

// @route   GET /api/admin/cash-register/:id
// @desc    Get cash register detail
// @access  Admin
router.get(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const register = await CashRegister.findById(req.params.id)
        .populate("openedBy", "name")
        .populate("closedBy", "name");

      if (!register) {
        res.status(404).json({ error: "Registro de caja no encontrado" });
        return;
      }

      res.json({ success: true, data: register });
    } catch (error) {
      console.error("Get register error:", error);
      res.status(500).json({ error: "Error al obtener caja" });
    }
  },
);

export default router;
