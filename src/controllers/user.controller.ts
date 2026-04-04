/**
 * User Controller
 */

import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response.util";

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
}
