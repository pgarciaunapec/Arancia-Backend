/**
 * User Controller
 */

import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/index";

export class UserController {
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);
      sendSuccess(res, user);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string | undefined;
      const result = await UserService.getAll(skip, limit, role);
      sendSuccess(res, {
        ...result,
        page: Math.floor(skip / limit) + 1,
      });
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  static async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await UserService.updateRole(id, role);
      sendSuccess(res, user, 200, "Rol de usuario actualizado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await UserService.delete(id);
      sendSuccess(
        res,
        { message: "Usuario eliminado" },
        200,
        "Usuario eliminado",
      );
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  // Saved Addresses Methods
  static async getSavedAddresses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const addresses = await UserService.getSavedAddresses(userId);
      sendSuccess(res, addresses);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async addSavedAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const address = await UserService.addSavedAddress(userId, req.body);
      sendSuccess(res, address, 201, "Dirección guardada exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async updateSavedAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const address = await UserService.updateSavedAddress(userId, addressId, req.body);
      sendSuccess(res, address, 200, "Dirección actualizada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async deleteSavedAddress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { addressId } = req.params;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      await UserService.deleteSavedAddress(userId, addressId);
      sendSuccess(res, { message: "Dirección eliminada" }, 200, "Dirección eliminada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  // Saved Cards Methods
  static async getSavedCards(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const cards = await UserService.getSavedCards(userId);
      sendSuccess(res, cards);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async addSavedCard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const card = await UserService.addSavedCard(userId, req.body);
      sendSuccess(res, card, 201, "Tarjeta guardada exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async updateSavedCard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { cardId } = req.params;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      const card = await UserService.updateSavedCard(userId, cardId, req.body);
      sendSuccess(res, card, 200, "Tarjeta actualizada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async deleteSavedCard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { cardId } = req.params;
      if (!userId) {
        sendError(res, "Usuario no autenticado", 401);
        return;
      }
      await UserService.deleteSavedCard(userId, cardId);
      sendSuccess(res, { message: "Tarjeta eliminada" }, 200, "Tarjeta eliminada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }
}
