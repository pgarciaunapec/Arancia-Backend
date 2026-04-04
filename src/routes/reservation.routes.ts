/**
 * Reservation Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { ReservationController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateCreateReservation,
  validateMongoId,
  handleValidationErrors,
} from "../utils/index";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crear una nueva reservación
 *     tags:
 *       - Reservaciones
 */
router.post(
  "/",
  validateCreateReservation(),
  handleValidationErrors,
  ReservationController.create,
);

/**
 * @swagger
 * /reservations/my-reservations:
 *   get:
 *     summary: Obtener mis reservaciones
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 */
router.get("/my-reservations", authMiddleware, ReservationController.getUserReservations);
router.get("/my", authMiddleware, ReservationController.getUserReservations);

/**
 * @swagger
 * /reservations/:id:
 *   get:
 *     summary: Obtener una reservación específica
 *     tags:
 *       - Reservaciones
 */
router.get("/:id", validateMongoId(), handleValidationErrors, ReservationController.getById);

/**
 * @swagger
 * /admin/reservations:
 *   get:
 *     summary: Obtener todas las reservaciones (admin)
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  ReservationController.getAll,
);

/**
 * @swagger
 * /admin/reservations/by-date/:date:
 *   get:
 *     summary: Obtener reservaciones por fecha (admin)
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/admin/by-date/:date",
  authMiddleware,
  adminMiddleware,
  ReservationController.getByDate,
);

/**
 * @swagger
 * /reservations/:id:
 *   put:
 *     summary: Actualizar una reservación
 *     tags:
 *       - Reservaciones
 */
router.put(
  "/:id",
  validateMongoId(),
  handleValidationErrors,
  ReservationController.update,
);

/**
 * @swagger
 * /reservations/:id/cancel:
 *   post:
 *     summary: Cancelar una reservación
 *     tags:
 *       - Reservaciones
 */
router.post(
  "/:id/cancel",
  validateMongoId(),
  handleValidationErrors,
  ReservationController.cancel,
);

router.put(
  "/:id/cancel",
  validateMongoId(),
  handleValidationErrors,
  ReservationController.cancel,
);

/**
 * @swagger
 * /admin/reservations/:id/confirm:
 *   post:
 *     summary: Confirmar una reservación (admin)
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/admin/:id/confirm",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  ReservationController.confirm,
);

export default router;

