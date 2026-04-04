/**
 * Order Routes - Refactored with controllers
 */

import { Router, type Router as ExpressRouter } from "express";
import { OrderController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateCreateOrder,
  validateMongoId,
  handleValidationErrors,
} from "../utils/index";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  validateCreateOrder(),
  handleValidationErrors,
  OrderController.create,
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener mis órdenes
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  authMiddleware,
  OrderController.getUserOrders,
);

/**
 * @swagger
 * /orders/:id:
 *   get:
 *     summary: Obtener una orden específica
 *     tags:
 *       - Órdenes
 */
router.get("/:id", validateMongoId(), handleValidationErrors, OrderController.getById);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Obtener todas las órdenes (admin)
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  OrderController.getAll,
);

/**
 * @swagger
 * /orders/:id/status:
 *   put:
 *     summary: Actualizar estado de orden (admin)
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  OrderController.updateStatus,
);

/**
 * @swagger
 * /orders/:id/payment-status:
 *   put:
 *     summary: Actualizar estado de pago
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/payment-status",
  authMiddleware,
  validateMongoId(),
  handleValidationErrors,
  OrderController.updatePaymentStatus,
);

/**
 * @swagger
 * /orders/:id/cancel:
 *   post:
 *     summary: Cancelar una orden
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:id/cancel",
  authMiddleware,
  validateMongoId(),
  handleValidationErrors,
  OrderController.cancel,
);

export default router;

