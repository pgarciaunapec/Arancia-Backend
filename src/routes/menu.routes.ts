import { Router, type Router as ExpressRouter } from "express";
import { MenuItemController } from "../controllers/index";
import {
  validateCreateMenuItem,
  validateMongoId,
  handleValidationErrors,
} from "../utils/index";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Obtener menú completo con filtros
 *     tags:
 *       - Menú
 */
router.get("/", MenuItemController.getAll);

/**
 * @swagger
 * /menu/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags:
 *       - Menú
 */
router.get("/categories", MenuItemController.getCategories);

/**
 * @swagger
 * /menu/search/:query:
 *   get:
 *     summary: Buscar artículos de menú
 *     tags:
 *       - Menú
 */
router.get("/search/:query", MenuItemController.search);

/**
 * @swagger
 * /menu/:id:
 *   get:
 *     summary: Obtener un artículo de menú
 *     tags:
 *       - Menú
 */
router.get(
  "/:id",
  validateMongoId(),
  handleValidationErrors,
  MenuItemController.getById,
);

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Crear nuevo artículo de menú (admin)
 *     tags:
 *       - Menú
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateMenuItem(),
  handleValidationErrors,
  MenuItemController.create,
);

/**
 * @swagger
 * /menu/:id:
 *   put:
 *     summary: Actualizar artículo de menú (admin)
 *     tags:
 *       - Menú
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  MenuItemController.update,
);

/**
 * @swagger
 * /menu/:id:
 *   delete:
 *     summary: Eliminar artículo de menú (admin)
 *     tags:
 *       - Menú
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateMongoId(),
  handleValidationErrors,
  MenuItemController.delete,
);

export default router;
