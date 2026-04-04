/**
 * Contact Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { ContactController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateCreateContact,
  validateMongoId,
  handleValidationErrors,
} from "../utils/index";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags:
 *       - Contacto
 */
router.post(
  "/",
  validateCreateContact(),
  handleValidationErrors,
  ContactController.create,
);

/**
 * @swagger
 * /admin/contact:
 *   get:
 *     summary: Obtener todos los mensajes de contacto (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  ContactController.getAll,
);

/**
 * @swagger
 * /contact/:id:
 *   get:
 *     summary: Obtener un mensaje de contacto
 *     tags:
 *       - Contacto
 */
router.get("/:id", validateMongoId(), handleValidationErrors, ContactController.getById);

/**
 * @swagger
 * /contact/:id/status:
 *   put:
 *     summary: Actualizar estado de mensaje (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  ContactController.updateStatus,
);

/**
 * @swagger
 * /contact/:id:
 *   delete:
 *     summary: Eliminar un mensaje (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  ContactController.delete,
);

export default router;

