/**
 * Reservation DTOs - Data Transfer Objects for Reservations
 */

// Request DTOs
export interface CreateReservationRequestDTO {
  date: Date;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  location?: string;
}

export interface UpdateReservationRequestDTO {
  date?: Date;
  time?: string;
  guests?: number;
  name?: string;
  phone?: string;
  notes?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  acceptAdditionalCharge?: boolean;
}

export interface ReservationPricingDTO {
  coverPerGuest: number;
  previousTotal: number;
  newTotal: number;
  delta: number;
  additionalChargeApplied: boolean;
}

// Response DTOs
export interface ReservationResponseDTO {
  _id: string;
  user?: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: string;
  location: string;
  pricing?: ReservationPricingDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationListResponseDTO {
  success: boolean;
  count: number;
  data: ReservationResponseDTO[];
}
