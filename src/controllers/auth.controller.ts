/**
 * Auth Controller
 * Handles authentication endpoints: register, login, profile
 */

import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  UpdateProfileRequestDTO,
} from "../dtos/index";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/index";

export class AuthController {
  /**
   * POST /auth/register
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const dto: RegisterRequestDTO = req.body;
      const result = await AuthService.register(dto);
      sendSuccess(
        res,
        {
          user: result.user,
          token: result.token,
        },
        201,
        "Usuario registrado exitosamente",
      );
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes("ya está") ? 409 : 500;
        sendError(res, error.message, statusCode);
      }
    }
  }

  /**
   * POST /auth/login
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginRequestDTO = req.body;
      const result = await AuthService.login(dto);
      sendSuccess(
        res,
        {
          user: result.user,
          token: result.token,
        },
        200,
        "Sesión iniciada exitosamente",
      );
    } catch (error) {
      if (error instanceof Error) {
        const isMissingFields = error.message.includes(
          "Por favor, completa todos los campos.",
        );
        const knownMessage =
          isMissingFields ||
          error.message.includes("El correo o la contraseña no coinciden.")
            ? error.message
            : "El correo o la contraseña no coinciden.";

        sendError(res, knownMessage, isMissingFields ? 400 : 401);
      }
    }
  }

  /**
   * GET /auth/me
   * Get current user profile
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const user = await UserService.getById(req.user.id);
      sendSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  /**
   * PUT /auth/profile
   * Update current user profile
   */
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const dto: UpdateProfileRequestDTO = req.body;
      const user = await UserService.updateProfile(req.user.id, dto);
      sendSuccess(res, user, 200, "Perfil actualizado exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * POST /auth/change-password
   * Change user password
   */
  static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const dto: ChangePasswordRequestDTO = req.body;
      await AuthService.changePassword(req.user.id, dto);
      sendSuccess(
        res,
        { message: "Contraseña cambiadaexitosamente" },
        200,
        "Contraseña actualizada",
      );
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * POST /auth/verify-token
   * Verify JWT token validity
   */
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        sendError(res, "Token no proporcionado", 401);
        return;
      }
      const decoded = AuthService.verifyToken(token);
      sendSuccess(res, {
        valid: true,
        userId: decoded.id,
        email: decoded.email,
      });
    } catch (error) {
      sendError(res, "Token inválido", 401);
    }
  }
}
