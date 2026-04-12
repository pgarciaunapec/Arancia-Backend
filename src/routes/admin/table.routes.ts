import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Table, User } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import("express").Router = Router();

/**
 * @swagger
 * /admin/tables:
 *   get:
 *     summary: Obtener todas las mesas
 *     description: Retorna la lista de todas las mesas del restaurante con su estado actual
 *     tags:
 *       - Admin - Mesas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mesas obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Table'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos suficientes
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tables = await Table.find({ isActive: true })
        .populate("activeBill")
        .populate("assignedStaff", "name email")
        .sort({ number: 1 });
      res.json({ success: true, data: tables });
    } catch (error) {
      console.error("Get tables error:", error);
      res.status(500).json({ error: "Error al obtener mesas" });
    }
  },
);

// @route   GET /api/admin/tables/available
// @desc    Get available tables (optional filter by guests)
// @access  Admin/Staff
router.get(
  "/available",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const guests = parseInt((req.query.guests as string) || "0", 10);
      const query: Record<string, unknown> = {
        isActive: true,
        status: "available",
      };

      if (Number.isFinite(guests) && guests > 0) {
        query.capacity = { $gte: guests };
      }

      const tables = await Table.find(query).sort({ capacity: 1, number: 1 });
      res.json({ success: true, data: tables });
    } catch (error) {
      console.error("Get available tables error:", error);
      res.status(500).json({ error: "Error al obtener disponibilidad" });
    }
  },
);

/**
 * @swagger
 * /admin/tables:
 *   post:
 *     summary: Crear una mesa
 *     description: Crea una nueva mesa en el sistema
 *     tags:
 *       - Admin - Mesas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
 *             properties:
 *               number:
 *                 type: integer
 *                 example: 1
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 4
 *               zone:
 *                 type: string
 *                 example: "Terraza"
 *     responses:
 *       201:
 *         description: Mesa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Table'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       409:
 *         description: Mesa duplicada
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("number").isInt({ min: 1 }).withMessage("Número de mesa requerido"),
    body("capacity")
      .isInt({ min: 1, max: 20 })
      .withMessage("Capacidad inválida"),
    body("zone").optional().trim(),
    body("image").optional().isString(),
    body("description").optional().isString(),
    body("assignedStaff").optional().isMongoId(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const existing = await Table.findOne({ number: req.body.number });
      if (existing) {
        res.status(409).json({ error: "Ya existe una mesa con ese número" });
        return;
      }

      if (req.body.assignedStaff) {
        const staff = await User.findById(req.body.assignedStaff)
          .select("role")
          .lean();
        if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
          res.status(400).json({ error: "Empleado asignado inválido" });
          return;
        }
      }

      const table = await Table.create({
        number: req.body.number,
        capacity: req.body.capacity,
        zone: req.body.zone,
        image: req.body.image,
        description: req.body.description,
        assignedStaff: req.body.assignedStaff,
      });
      res.status(201).json({ success: true, data: table });
    } catch (error) {
      console.error("Create table error:", error);
      res.status(500).json({ error: "Error al crear mesa" });
    }
  },
);

// @route   PATCH /api/admin/tables/:id
// @desc    Update table
// @access  Admin/Staff
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        status,
        capacity,
        zone,
        number,
        image,
        description,
        assignedStaff,
      } = req.body;
      const update: Record<string, unknown> = {};
      if (status) update.status = status;
      if (capacity) update.capacity = capacity;
      if (zone) update.zone = zone;
      if (number) update.number = number;
      if (image !== undefined) update.image = image;
      if (description !== undefined) update.description = description;
      if (assignedStaff !== undefined) {
        if (assignedStaff) {
          const staff = await User.findById(assignedStaff)
            .select("role")
            .lean();
          if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
            res.status(400).json({ error: "Empleado asignado inválido" });
            return;
          }
        }
        update.assignedStaff = assignedStaff || null;
      }

      const table = await Table.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      if (!table) {
        res.status(404).json({ error: "Mesa no encontrada" });
        return;
      }

      res.json({ success: true, data: table });
    } catch (error) {
      console.error("Update table error:", error);
      res.status(500).json({ error: "Error al actualizar mesa" });
    }
  },
);

// @route   PATCH /api/admin/tables/:id/assign-staff
// @desc    Assign or clear staff on a table
// @access  Admin/Staff
router.patch(
  "/:id/assign-staff",
  authMiddleware,
  requireRole(["admin", "staff"]),
  [body("staffId").optional({ nullable: true }).isMongoId()],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { staffId } = req.body as { staffId?: string | null };

      if (staffId) {
        const staff = await User.findById(staffId).select("role").lean();
        if (!staff || (staff.role !== "staff" && staff.role !== "admin")) {
          res.status(400).json({ error: "Empleado asignado inválido" });
          return;
        }
      }

      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { assignedStaff: staffId || null },
        { new: true },
      ).populate("assignedStaff", "name email");

      if (!table) {
        res.status(404).json({ error: "Mesa no encontrada" });
        return;
      }

      res.json({ success: true, data: table });
    } catch (error) {
      console.error("Assign staff table error:", error);
      res.status(500).json({ error: "Error al asignar empleado a la mesa" });
    }
  },
);

// @route   DELETE /api/admin/tables/:id
// @desc    Delete table (only if available and no active bills)
// @access  Admin
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const table = await Table.findById(req.params.id);
      if (!table) {
        res.status(404).json({ error: "Mesa no encontrada" });
        return;
      }

      if (table.status !== "available") {
        res
          .status(400)
          .json({ error: "Solo se pueden eliminar mesas disponibles" });
        return;
      }

      if (table.activeBill) {
        res.status(400).json({ error: "La mesa tiene una cuenta activa" });
        return;
      }

      await Table.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Mesa eliminada" });
    } catch (error) {
      console.error("Delete table error:", error);
      res.status(500).json({ error: "Error al eliminar mesa" });
    }
  },
);

export default router;
