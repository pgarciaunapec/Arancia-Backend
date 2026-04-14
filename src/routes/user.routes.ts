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
 * /users/me/saved-addresses:
 *   get:
 *     summary: Obtener direcciones guardadas del usuario actual
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/me/saved-addresses",
  authMiddleware,
  UserController.getSavedAddresses,
);

/**
 * @swagger
 * /users/me/saved-addresses:
 *   post:
 *     summary: Agregar nueva dirección guardada
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/me/saved-addresses",
  authMiddleware,
  validateYupBody(require("../schemas/yup.schemas").savedAddressYupSchema),
  UserController.addSavedAddress,
);

/**
 * @swagger
 * /users/me/saved-addresses/:addressId:
 *   put:
 *     summary: Actualizar dirección guardada
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/me/saved-addresses/:addressId",
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  validateYupBody(require("../schemas/yup.schemas").savedAddressYupSchema),
  UserController.updateSavedAddress,
);

/**
 * @swagger
 * /users/me/saved-addresses/:addressId:
 *   delete:
 *     summary: Eliminar dirección guardada
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/me/saved-addresses/:addressId",
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  UserController.deleteSavedAddress,
);

/**
 * @swagger
 * /users/me/saved-cards:
 *   get:
 *     summary: Obtener tarjetas guardadas del usuario actual
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/me/saved-cards",
  authMiddleware,
  UserController.getSavedCards,
);

/**
 * @swagger
 * /users/me/saved-cards:
 *   post:
 *     summary: Agregar nueva tarjeta guardada (solo últimos 4 dígitos)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/me/saved-cards",
  authMiddleware,
  validateYupBody(require("../schemas/yup.schemas").savedCardYupSchema),
  UserController.addSavedCard,
);

/**
 * @swagger
 * /users/me/saved-cards/:cardId:
 *   put:
 *     summary: Actualizar tarjeta guardada
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/me/saved-cards/:cardId",
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  validateYupBody(require("../schemas/yup.schemas").savedCardYupSchema),
  UserController.updateSavedCard,
);

/**
 * @swagger
 * /users/me/saved-cards/:cardId:
 *   delete:
 *     summary: Eliminar tarjeta guardada
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/me/saved-cards/:cardId",
  authMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  UserController.deleteSavedCard,
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

