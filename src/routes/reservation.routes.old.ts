import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Reservation } from "../models/index";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware/auth.middleware";
import { AuthRequest } from "../types/index";

const router = Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crear una nueva reservación
 *     description: Crea una reservación de mesa en el restaurante
 *     tags:
 *       - Reservaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *               - guests
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-20"
 *               time:
 *                 type: string
 *                 example: "19:30"
 *               guests:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 4
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/",
  optionalAuthMiddleware,
  [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("time").notEmpty().withMessage("La hora es requerida"),
    body("guests")
      .isInt({ min: 1, max: 20 })
      .withMessage("Número de personas inválido"),
    body("name").trim().notEmpty().withMessage("El nombre es requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("phone").trim().notEmpty().withMessage("El teléfono es requerido"),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { date, time, guests, name, email, phone, notes } = req.body;

      const reservation = await Reservation.create({
        user: req.user?.id,
        date: new Date(date),
        time,
        guests,
        name,
        email,
        phone,
        notes,
        status: "confirmed", // Auto-confirm for now
      });

      res.status(201).json({
        success: true,
        data: reservation,
        message: "Reservación creada exitosamente",
      });
    } catch (error) {
      console.error("Create reservation error:", error);
      res.status(500).json({ error: "Error al crear reservación" });
    }
  },
);

/**
 * @swagger
 * /reservations/my:
 *   get:
 *     summary: Obtener reservaciones del usuario
 *     description: Retorna todas las reservaciones del usuario autenticado
 *     tags:
 *       - Reservaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/my",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const reservations = await Reservation.find({ user: req.user?.id }).sort({
        date: -1,
      });

      // Update status for past reservations
      const now = new Date();
      const updatedReservations = reservations.map((res) => {
        const reservationDate = new Date(res.date);
        if (reservationDate < now && res.status === "confirmed") {
          return { ...res.toObject(), status: "completed" };
        }
        return res;
      });

      res.json({
        success: true,
        count: reservations.length,
        data: updatedReservations,
      });
    } catch (error) {
      console.error("Get my reservations error:", error);
      res.status(500).json({ error: "Error al obtener reservaciones" });
    }
  },
);

// @route   GET /api/reservations/:id
// @desc    Get reservation by ID
// @access  Private
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const reservation = await Reservation.findOne({
        _id: req.params.id,
        user: req.user?.id,
      });

      if (!reservation) {
        res.status(404).json({ error: "Reservación no encontrada" });
        return;
      }

      res.json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      console.error("Get reservation error:", error);
      res.status(500).json({ error: "Error al obtener reservación" });
    }
  },
);

// @route   PUT /api/reservations/:id/cancel
// @desc    Cancel a reservation
// @access  Private
router.put(
  "/:id/cancel",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const reservation = await Reservation.findOne({
        _id: req.params.id,
        user: req.user?.id,
      });

      if (!reservation) {
        res.status(404).json({ error: "Reservación no encontrada" });
        return;
      }

      if (reservation.status === "cancelled") {
        res.status(400).json({ error: "La reservación ya está cancelada" });
        return;
      }

      if (reservation.status === "completed") {
        res
          .status(400)
          .json({ error: "No se puede cancelar una reservación completada" });
        return;
      }

      reservation.status = "cancelled";
      await reservation.save();

      res.json({
        success: true,
        data: reservation,
        message: "Reservación cancelada exitosamente",
      });
    } catch (error) {
      console.error("Cancel reservation error:", error);
      res.status(500).json({ error: "Error al cancelar reservación" });
    }
  },
);

export default router;
