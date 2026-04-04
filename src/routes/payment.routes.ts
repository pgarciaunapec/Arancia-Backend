import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Order, Payment, Transaction } from "../models/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";
import { PaymentService } from "../services/payment.service";
import { DeliveryService } from "../services/delivery.service";

const router: import("express").Router = Router();

// @route   POST /api/payments
// @desc    Process a payment for an order
// @access  Private
router.post(
  "/",
  authMiddleware,
  [
    body("orderId").notEmpty().withMessage("ID de orden requerido"),
    body("method")
      .isIn(["cash", "card", "transfer"])
      .withMessage("Método de pago inválido"),
    body("cardNumber").optional().isString(),
    body("transferReference").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { orderId, method, cardNumber, transferReference } = req.body;

      const order = await Order.findOne({ _id: orderId, user: req.user!.id });
      if (!order) {
        res.status(404).json({ error: "Orden no encontrada" });
        return;
      }

      if (order.paymentStatus === "paid") {
        res.status(400).json({ error: "Esta orden ya fue pagada" });
        return;
      }

      // Generate unique reference
      const reference = await PaymentService.generateReference();

      // Build payment data
      const paymentData: Record<string, unknown> = {
        order: order._id,
        user: req.user!.id,
        amount: order.total,
        method,
        reference,
        status: "completed",
      };

      if (method === "card" && cardNumber) {
        paymentData.last4Digits = PaymentService.getLast4Digits(cardNumber);
        paymentData.cardHash = await PaymentService.hashCardNumber(cardNumber);
      }

      if (method === "transfer" && transferReference) {
        paymentData.transferReference = transferReference;
      }

      const payment = await Payment.create(paymentData);

      // Create transaction record
      await Transaction.create({
        payment: payment._id,
        type: "charge",
        amount: order.total,
        status: "completed",
        metadata: { method, reference },
      });

      // Update order payment status
      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();

      // If delivery, create delivery order
      if (order.isDelivery && order.shippingAddress) {
        await DeliveryService.createFromOrder(
          order._id.toString(),
          req.user!.id,
          order.shippingAddress,
        );
      }

      res.status(201).json({
        success: true,
        data: {
          payment: {
            _id: payment._id,
            reference: payment.reference,
            amount: payment.amount,
            method: payment.method,
            status: payment.status,
          },
          order: {
            _id: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
          },
        },
        message: "Pago procesado exitosamente",
      });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ error: "Error al procesar el pago" });
    }
  },
);

// @route   GET /api/payments/my
// @desc    Get user's payment history
// @access  Private
router.get(
  "/my",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payments = await Payment.find({ user: req.user!.id })
        .populate("order", "total items status createdAt")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ error: "Error al obtener pagos" });
    }
  },
);

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const payment = await Payment.findOne({
        _id: req.params.id,
        user: req.user!.id,
      }).populate("order", "total items status");

      if (!payment) {
        res.status(404).json({ error: "Pago no encontrado" });
        return;
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("Get payment error:", error);
      res.status(500).json({ error: "Error al obtener pago" });
    }
  },
);

export default router;
