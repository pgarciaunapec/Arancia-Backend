/**
 * Reservation Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { ReservationController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateYupBody,
  validateYupParams,
} from "../middleware/yupValidation.middleware";
import {
  createReservationYupSchema,
  mongoIdParamYupSchema,
  updateReservationYupSchema,
} from "../schemas/yup.schemas";

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
  authMiddleware,
  validateYupBody(createReservationYupSchema),
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
router.get(
  "/my-reservations",
  authMiddleware,
  ReservationController.getUserReservations,
);
router.get("/my", authMiddleware, ReservationController.getUserReservations);
router.get(
  "/availability",
  authMiddleware,
  ReservationController.getAvailability,
);

/**
 * @swagger
 * /reservations/:id:
 *   get:
 *     summary: Obtener una reservación específica
 *     tags:
 *       - Reservaciones
 */
router.get(
  "/:id",
  validateYupParams(mongoIdParamYupSchema),
  ReservationController.getById,
);

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
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  validateYupBody(updateReservationYupSchema),
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
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  ReservationController.cancel,
);
router.put(
  "/:id/cancel",
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
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
  validateYupParams(mongoIdParamYupSchema),
  ReservationController.confirm,
);

export default router;
