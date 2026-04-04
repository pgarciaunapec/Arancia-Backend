/**
 * User Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { UserController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateMongoId,
  handleValidationErrors,
} from "../utils/index";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios (admin)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  UserController.getAll,
);

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Obtener un usuario específico
 *     tags:
 *       - Usuarios
 */
router.get("/:id", validateMongoId(), handleValidationErrors, UserController.getById);

/**
 * @swagger
 * /users/:id/role:
 *   put:
 *     summary: Actualizar rol de usuario (admin)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  UserController.updateRole,
);

/**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Eliminar un usuario (admin)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  UserController.delete,
);

export default router;

