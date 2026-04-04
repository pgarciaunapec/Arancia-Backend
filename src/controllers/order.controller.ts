/**
 * Order Controller
 * Handles order endpoints
 */

import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import {
  CreateOrderRequestDTO,
  UpdateOrderStatusRequestDTO,
} from "../dtos/index";
import { sendSuccess, sendError } from "../utils/response.util";
import { AuthRequest } from "../types/index";

export class OrderController {
  /**
   * POST /orders
   * Create a new order
   */
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const dto: CreateOrderRequestDTO = req.body;
      const order = await OrderService.create(req.user.id, dto);
      sendSuccess(res, order, 201, "Orden creada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * GET /orders/:id
   * Get order by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getById(id);
      sendSuccess(res, order);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  /**
   * GET /orders
   * Get user's orders
   */
  static async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, "No autorizado", 401);
        return;
      }
      const orders = await OrderService.getUserOrders(req.user.id);
      sendSuccess(res, {
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  /**
   * GET /admin/orders
   * Get all orders (admin)
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await OrderService.getAll(skip, limit);
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

  /**
   * PUT /orders/:id/status
   * Update order status
   */
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateOrderStatusRequestDTO = req.body;
      const order = await OrderService.updateStatus(id, dto);
      sendSuccess(res, order, 200, "Estado de orden actualizado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * PUT /orders/:id/payment-status
   * Update payment status
   */
  static async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      const order = await OrderService.updatePaymentStatus(id, paymentStatus);
      sendSuccess(res, order, 200, "Estado de pago actualizado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * POST /orders/:id/cancel
   * Cancel an order
   */
  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.cancel(id);
      sendSuccess(res, order, 200, "Orden cancelada");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }
}
