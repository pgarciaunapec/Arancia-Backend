/**
 * MenuItem Controller
 * Handles menu endpoints: get, create, update, delete
 */

import { Request, Response } from "express";
import { MenuItemService } from "../services/menu.service";
import {
  CreateMenuItemRequestDTO,
  UpdateMenuItemRequestDTO,
} from "../dtos/index";
import { sendSuccess, sendError } from "../utils/response.util";

export class MenuItemController {
  /**
   * GET /menu
   * Get all menu items with filtering
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, available } = req.query;
      const items = await MenuItemService.getAll(
        category as string | undefined,
        search as string | undefined,
        available === "true",
      );
      sendSuccess(res, items);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  /**
   * GET /menu/categories
   * Get all unique categories
   */
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await MenuItemService.getCategories();
      sendSuccess(res, categories);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }

  /**
   * GET /menu/:id
   * Get a single menu item
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await MenuItemService.getById(id);
      sendSuccess(res, item);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  /**
   * POST /menu
   * Create a new menu item (admin)
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateMenuItemRequestDTO = req.body;
      const item = await MenuItemService.create(dto);
      sendSuccess(res, item, 201, "Artículo de menú creado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * PUT /menu/:id
   * Update a menu item (admin)
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: UpdateMenuItemRequestDTO = req.body;
      const item = await MenuItemService.update(id, dto);
      sendSuccess(res, item, 200, "Artículo de menú actualizado");
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
      }
    }
  }

  /**
   * DELETE /menu/:id
   * Delete a menu item (admin)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await MenuItemService.delete(id);
      sendSuccess(
        res,
        { message: "Artículo de menú eliminado" },
        200,
        "Artículo eliminado",
      );
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 404);
      }
    }
  }

  /**
   * GET /menu/search/:query
   * Search menu items
   */
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.params;
      const items = await MenuItemService.search(query);
      sendSuccess(res, items);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
      }
    }
  }
}
