import { Router, type Router as ExpressRouter } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/index";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateProfile,
  handleValidationErrors,
} from "../utils/index";

const router: ExpressRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 */
router.post(
  "/register",
  authLimiter,
  validateRegister(),
  handleValidationErrors,
  AuthController.register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 */
router.post(
  "/login",
  authLimiter,
  validateLogin(),
  handleValidationErrors,
  AuthController.login,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", authMiddleware, AuthController.getCurrentUser);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/profile",
  authMiddleware,
  validateUpdateProfile(),
  handleValidationErrors,
  AuthController.updateProfile,
);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/change-password",
  authMiddleware,
  validateChangePassword(),
  handleValidationErrors,
  AuthController.changePassword,
);

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verificar validez de token JWT
 *     tags:
 *       - Autenticación
 */
router.post("/verify-token", AuthController.verifyToken);

export default router;
