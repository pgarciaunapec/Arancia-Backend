/**
 * User Routes - Refactored
 */

import { Router, type Router as ExpressRouter } from "express";
import { AuthController, UserController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateYupBody,
  validateYupParams,
} from "../middleware/yupValidation.middleware";
import {
  changePasswordYupSchema,
  mongoIdParamYupSchema,
  updateProfileYupSchema,
} from "../schemas/yup.schemas";


const router: ExpressRouter = Router();

router.put(
  "/profile",
  authMiddleware,
  validateYupBody(updateProfileYupSchema),
  AuthController.updateProfile,
);

router.put(
  "/password",
  authMiddleware,
  validateYupBody(changePasswordYupSchema),
  AuthController.changePassword,
);

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
router.get("/:id", validateYupParams(mongoIdParamYupSchema), UserController.getById);

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
  validateYupParams(mongoIdParamYupSchema),
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
  validateYupParams(mongoIdParamYupSchema),
  UserController.delete,
);

export default router;

