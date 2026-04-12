import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { Vehicle } from "../../models/index";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { AuthRequest } from "../../types/index";

const router: import("express").Router = Router();

// @route   GET /api/admin/fleet
// @desc    List fleet vehicles
// @access  Admin/Staff
router.get(
  "/",
  authMiddleware,
  requireRole(["admin", "staff"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.query;
      const query: Record<string, unknown> = { isActive: true };
      if (status) {
        query.status = status;
      }

      const vehicles = await Vehicle.find(query).sort({ status: 1, plate: 1 });
      res.json({ success: true, data: vehicles });
    } catch (error) {
      console.error("Get fleet error:", error);
      res.status(500).json({ error: "Error al obtener flota" });
    }
  },
);

// @route   POST /api/admin/fleet
// @desc    Create vehicle
// @access  Admin
router.post(
  "/",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("plate").trim().notEmpty().withMessage("Placa requerida"),
    body("type")
      .isIn(["motorbike", "car", "van", "bicycle"])
      .withMessage("Tipo de vehículo inválido"),
    body("vehicleModel").trim().notEmpty().withMessage("Modelo requerido"),
    body("capacityOrders")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Capacidad inválida"),
    body("status")
      .optional()
      .isIn(["available", "in_use", "maintenance", "inactive"]),
    body("notes").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const plate = String(req.body.plate).trim().toUpperCase();
      const existing = await Vehicle.findOne({ plate });
      if (existing) {
        res.status(409).json({ error: "Ya existe un vehículo con esa placa" });
        return;
      }

      const vehicle = await Vehicle.create({
        plate,
        type: req.body.type,
        vehicleModel: req.body.vehicleModel,
        capacityOrders: req.body.capacityOrders || 1,
        status: req.body.status || "available",
        notes: req.body.notes,
      });

      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      console.error("Create fleet vehicle error:", error);
      res.status(500).json({ error: "Error al crear vehículo" });
    }
  },
);

// @route   PATCH /api/admin/fleet/:id
// @desc    Update vehicle
// @access  Admin
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  [
    body("plate").optional().isString(),
    body("type").optional().isIn(["motorbike", "car", "van", "bicycle"]),
    body("vehicleModel").optional().isString(),
    body("capacityOrders").optional().isInt({ min: 1, max: 10 }),
    body("status")
      .optional()
      .isIn(["available", "in_use", "maintenance", "inactive"]),
    body("notes").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const update: Record<string, unknown> = {};
      const { plate, type, vehicleModel, capacityOrders, status, notes } =
        req.body;
      if (plate !== undefined)
        update.plate = String(plate).trim().toUpperCase();
      if (type !== undefined) update.type = type;
      if (vehicleModel !== undefined) update.vehicleModel = vehicleModel;
      if (capacityOrders !== undefined) update.capacityOrders = capacityOrders;
      if (status !== undefined) update.status = status;
      if (notes !== undefined) update.notes = notes;

      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      });

      if (!vehicle) {
        res.status(404).json({ error: "Vehículo no encontrado" });
        return;
      }

      res.json({ success: true, data: vehicle });
    } catch (error) {
      console.error("Update fleet vehicle error:", error);
      res.status(500).json({ error: "Error al actualizar vehículo" });
    }
  },
);

// @route   DELETE /api/admin/fleet/:id
// @desc    Soft delete vehicle
// @access  Admin
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { isActive: false, status: "inactive" },
        { new: true },
      );

      if (!vehicle) {
        res.status(404).json({ error: "Vehículo no encontrado" });
        return;
      }

      res.json({ success: true, message: "Vehículo desactivado" });
    } catch (error) {
      console.error("Delete fleet vehicle error:", error);
      res.status(500).json({ error: "Error al desactivar vehículo" });
    }
  },
);

export default router;
