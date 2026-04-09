/**
 * Contact Controller
 */

import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";
import { CreateContactRequestDTO } from "../dtos/index";
import { sendSuccess, sendError } from "../utils/response.util";

export class ContactController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateContactRequestDTO = req.body;
      const contact = await ContactService.create(dto);
      sendSuccess(res, contact, 201, "Mensaje de contacto enviado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contact = await ContactService.getById(id);
      sendSuccess(res, contact);
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
      const status = req.query.status as string | undefined;
      const result = await ContactService.getAll(skip, limit, status);
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

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contact = await ContactService.updateStatus(id, status);
      sendSuccess(res, contact, 200, "Estado actualizado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ContactService.delete(id);
      sendSuccess(
        res,
        { message: "Mensaje eliminado" },
        200,
        "Mensaje eliminado",
      );
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }
}
