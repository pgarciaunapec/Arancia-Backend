import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Order } from "../models/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";

const router: import("express").Router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     description: Convierte el carrito en una orden de compra
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   zip:
 *                     type: string
 *               isDelivery:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *       400:
 *         description: Carrito vacío o datos inválidos
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/",
  authMiddleware,
  [
    body("shippingAddress.name")
      .notEmpty()
      .withMessage("Nombre de envío requerido"),
    body("shippingAddress.address")
      .notEmpty()
      .withMessage("Dirección requerida"),
    body("shippingAddress.city").notEmpty().withMessage("Ciudad requerida"),
    body("shippingAddress.zip")
      .notEmpty()
      .withMessage("Código postal requerido"),
    body("isDelivery").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { shippingAddress, isDelivery } = req.body;

      // Get cart
      const cart = await Order.findOne({ user: req.user!.id, status: "cart" });
      if (!cart || cart.items.length === 0) {
        res.status(400).json({ error: "El carrito está vacío" });
        return;
      }

      // Update cart to order
      cart.status = "pending";
      cart.shippingAddress = shippingAddress;
      cart.isDelivery = isDelivery || false;
      cart.paymentStatus = "pending";
      await cart.save();

      // Generate order number
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

      res.status(201).json({
        success: true,
        data: {
          ...cart.toObject(),
          orderNumber,
        },
        message: `Pedido ${orderNumber} creado exitosamente`,
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Error al crear el pedido" });
    }
  },
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener historial de órdenes del usuario
 *     description: Retorna todas las órdenes del usuario autenticado
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Órdenes obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({
        user: req.user!.id,
        status: { $ne: "cart" },
      })
        .sort({ createdAt: -1 })
        .populate("items.menuItem", "name image");

      res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Error al obtener órdenes" });
    }
  },
);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user!.id,
      }).populate("items.menuItem", "name image");

      if (!order) {
        res.status(404).json({ error: "Orden no encontrada" });
        return;
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Error al obtener orden" });
    }
  },
);

export default router;
