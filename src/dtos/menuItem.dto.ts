/**
 * MenuItem DTOs - Data Transfer Objects for Menu Items
 */

// Request DTOs
export interface CreateMenuItemRequestDTO {
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
  available?: boolean;
}

export interface UpdateMenuItemRequestDTO {
  name?: string;
  category?: string;
  price?: number;
  ingredients?: string[];
  image?: string;
  available?: boolean;
}

// Response DTOs
export interface MenuItemResponseDTO {
  _id: string;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemListResponseDTO {
  success: boolean;
  count: number;
  data: MenuItemResponseDTO[];
}

export interface CategoriesResponseDTO {
  success: boolean;
  data: string[];
}
