/**
 * Common DTOs shared across multiple entities
 */

export interface SuccessResponseDTO<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponseDTO {
  success: boolean;
  error: string;
  details?: Record<string, unknown>;
}

export interface PaginationDTO {
  limit: number;
  skip: number;
  page: number;
}

/**
 * Contact/Support DTOs
 */
export interface CreateContactRequestDTO {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponseDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Image DTOs
 */
export interface ImageResponseDTO {
  _id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EventRequest DTOs
 */
export interface CreateEventRequestDTO {
  name: string;
  email: string;
  phone: string;
  eventType: "social" | "corporativo" | "privado" | "otro";
  packageName?: "Esencial" | "Premium" | "Elite";
  guests: number;
  preferredDate?: Date;
  notes?: string;
}

export interface EventRequestResponseDTO {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  packageName?: string;
  guests: number;
  preferredDate?: Date;
  notes?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
