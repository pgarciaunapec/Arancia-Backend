/**
 * MenuItem Service
 * Handles menu item operations: CRUD, search, filtering
 */

import { MenuItem } from "../models/MenuItem";
import {
  CreateMenuItemRequestDTO,
  UpdateMenuItemRequestDTO,
  MenuItemResponseDTO,
} from "../dtos/index";

export class MenuItemService {
  /**
   * Get all menu items with filtering and search
   */
  static async getAll(
    category?: string,
    search?: string,
    available?: boolean,
  ): Promise<MenuItemResponseDTO[]> {
    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available = available;
    }

    let query = MenuItem.find(filter);

    if (search) {
      query = MenuItem.find({
        ...filter,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { ingredients: { $in: [new RegExp(search, "i")] } },
        ],
      });
    }

    const items = await query.sort({ category: 1, name: 1 });
    return items.map((item) => this.mapToResponseDTO(item));
  }

  /**
   * Get a single menu item by ID
   */
  static async getById(id: string): Promise<MenuItemResponseDTO> {
    const item = await MenuItem.findById(id);
    if (!item) {
      throw new Error("Artículo de menú no encontrado");
    }
    return this.mapToResponseDTO(item);
  }

  /**
   * Create a new menu item
   */
  static async create(
    dto: CreateMenuItemRequestDTO,
  ): Promise<MenuItemResponseDTO> {
    const item = await MenuItem.create({
      name: dto.name,
      category: dto.category,
      price: dto.price,
      ingredients: dto.ingredients,
      image: dto.image,
      available: dto.available !== false,
    });
    return this.mapToResponseDTO(item);
  }

  /**
   * Update a menu item
   */
  static async update(
    id: string,
    dto: UpdateMenuItemRequestDTO,
  ): Promise<MenuItemResponseDTO> {
    const item = await MenuItem.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );
    if (!item) {
      throw new Error("Artículo de menú no encontrado");
    }
    return this.mapToResponseDTO(item);
  }

  /**
   * Delete a menu item
   */
  static async delete(id: string): Promise<void> {
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      throw new Error("Artículo de menú no encontrado");
    }
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    const categories = await MenuItem.distinct("category").sort();
    return categories;
  }

  /**
   * Search menu items by name or ingredients
   */
  static async search(query: string): Promise<MenuItemResponseDTO[]> {
    const items = await MenuItem.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { ingredients: { $in: [new RegExp(query, "i")] } },
      ],
      available: true,
    });
    return items.map((item) => this.mapToResponseDTO(item));
  }

  /**
   * Map to response DTO
   */
  private static mapToResponseDTO(item: any): MenuItemResponseDTO {
    return {
      _id: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      ingredients: item.ingredients,
      image: item.image,
      available: item.available,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
