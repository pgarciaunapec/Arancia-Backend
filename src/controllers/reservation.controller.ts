/**
 * Reservation Controller
 */

import { Request, Response } from "express";
import { ReservationService } from "../services/reservation.service";
import {
  CreateReservationRequestDTO,
  UpdateReservationRequestDTO,
} from "../dtos/index";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/index";

export class ReservationController {
  static async getAvailability(req: Request, res: Response): Promise<void> {
    try {
      const guests = req.query.guests
        ? parseInt(req.query.guests as string, 10)
        : undefined;
      const tables = await ReservationService.getAvailability(guests);
      sendSuccess(res, {
        count: tables.length,
        data: tables,
      });
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const actor = (req as AuthRequest).user;
      if (!actor) {
        sendError(res, "Debes iniciar sesión para reservar.", 401);
        return;
      }

      const dto: CreateReservationRequestDTO = req.body;
      const reservation = await ReservationService.create(dto, actor.id);
      sendSuccess(res, reservation, 201, "Reservación creada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getById(id);
      sendSuccess(res, reservation);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  static async getUserReservations(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const reservations = await ReservationService.getUserReservations(
        req.user.id,
      );
      sendSuccess(res, {
        count: reservations.length,
        data: reservations,
      });
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await ReservationService.getAll(skip, limit);
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

  static async getByDate(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.params;
      const reservations = await ReservationService.getByDate(new Date(date));
      sendSuccess(res, {
        count: reservations.length,
        data: reservations,
      });
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateReservationRequestDTO = req.body;
      const reservation = await ReservationService.update(id, dto, req.user);
      sendSuccess(res, reservation, 200, "Reservación actualizada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async cancel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.cancel(id, req.user);
      sendSuccess(res, reservation, 200, "Reservación cancelada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  static async confirm(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.confirm(id);
      sendSuccess(res, reservation, 200, "Reservación confirmada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }
}
