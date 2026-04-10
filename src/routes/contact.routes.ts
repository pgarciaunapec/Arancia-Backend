/**
 * Contact Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { ContactController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateYupBody,
  validateYupParams,
} from "../middleware/yupValidation.middleware";
import {
  createContactYupSchema,
  mongoIdParamYupSchema,
} from "../schemas/yup.schemas";

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
  validateYupBody(createContactYupSchema),
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
router.get("/:id", validateYupParams(mongoIdParamYupSchema), ContactController.getById);

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
  validateYupParams(mongoIdParamYupSchema),
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
  validateYupParams(mongoIdParamYupSchema),
  ContactController.delete,
);

export default router;

