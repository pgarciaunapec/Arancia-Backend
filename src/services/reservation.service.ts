/**
 * Reservation Service
 * Handles reservation operations: create, update, retrieve, cancel
 */

import { Reservation } from "../models/Reservation";
import {
  CreateReservationRequestDTO,
  UpdateReservationRequestDTO,
  ReservationResponseDTO,
  ReservationPricingDTO,
} from "../dtos/index";

const COVER_PRICE_PER_GUEST = 500;

type ReservationActor = {
  id: string;
  role?: string;
};

export class ReservationService {
  private static canManageReservation(
    reservationUserId: unknown,
    actor?: ReservationActor,
  ): boolean {
    if (!actor) {
      return false;
    }

    if (actor.role === "admin" || actor.role === "staff") {
      return true;
    }

    if (!reservationUserId) {
      return false;
    }

    return String(reservationUserId) === actor.id;
  }

  /**
   * Create a new reservation
   */
  static async create(
    dto: CreateReservationRequestDTO,
    userId?: string,
  ): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.create({
      user: userId,
      date: dto.date,
      time: dto.time,
      guests: dto.guests,
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      notes: dto.notes,
      location: dto.location || "Restaurante Principal",
      status: "pending",
    });

    return this.mapToResponseDTO(reservation);
  }

  /**
   * Get reservation by ID
   */
  static async getById(id: string): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error("Reservación no encontrada");
    }
    return this.mapToResponseDTO(reservation);
  }

  /**
   * Get all reservations for a user
   */
  static async getUserReservations(
    userId: string,
  ): Promise<ReservationResponseDTO[]> {
    const reservations = await Reservation.find({ user: userId }).sort({
      date: -1,
    });
    return reservations.map((res) => this.mapToResponseDTO(res));
  }

  /**
   * Get all reservations (admin)
   */
  static async getAll(
    skip: number = 0,
    limit: number = 10,
  ): Promise<{
    data: ReservationResponseDTO[];
    total: number;
  }> {
    const total = await Reservation.countDocuments();
    const reservations = await Reservation.find()
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    return {
      data: reservations.map((res) => this.mapToResponseDTO(res)),
      total,
    };
  }

  /**
   * Get reservations by date (for admin calendar)
   */
  static async getByDate(date: Date): Promise<ReservationResponseDTO[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ time: 1 });

    return reservations.map((res) => this.mapToResponseDTO(res));
  }

  /**
   * Update a reservation
   */
  static async update(
    id: string,
    dto: UpdateReservationRequestDTO,
    actor?: ReservationActor,
  ): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      throw new Error("Reservación no encontrada");
    }

    if (!actor) {
      throw new Error("No autorizado");
    }

    if (!this.canManageReservation(reservation.user, actor)) {
      throw new Error("No tienes permisos para editar esta reservación");
    }

    if (reservation.status === "cancelled") {
      throw new Error("No se puede editar una reservación cancelada");
    }

    if (reservation.status === "completed") {
      throw new Error("No se puede editar una reservación completada");
    }

    if (
      actor.role !== "admin" &&
      actor.role !== "staff" &&
      dto.status &&
      dto.status !== reservation.status
    ) {
      throw new Error("Solo el personal puede cambiar el estado de la reservación");
    }

    const nextGuests = dto.guests ?? reservation.guests;
    const previousTotal = reservation.guests * COVER_PRICE_PER_GUEST;
    const newTotal = nextGuests * COVER_PRICE_PER_GUEST;
    const delta = newTotal - previousTotal;

    const isPaidReservation = reservation.status === "confirmed";

    if (isPaidReservation && delta > 0 && !dto.acceptAdditionalCharge) {
      throw new Error(
        `La reserva ya está pagada. Este ajuste requiere un cobro adicional de RD$${delta}. Confirma para continuar.`,
      );
    }

    const { acceptAdditionalCharge: _acceptAdditionalCharge, ...updates } = dto;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        (reservation as any)[key] = value;
      }
    }

    await reservation.save();

    const pricing: ReservationPricingDTO = {
      coverPerGuest: COVER_PRICE_PER_GUEST,
      previousTotal,
      newTotal,
      delta,
      additionalChargeApplied: isPaidReservation && delta > 0,
    };

    return this.mapToResponseDTO(reservation, pricing);
  }

  /**
   * Cancel a reservation
   */
  static async cancel(
    id: string,
    actor?: ReservationActor,
  ): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error("Reservación no encontrada");
    }

    if (!actor) {
      throw new Error("No autorizado");
    }

    if (!this.canManageReservation(reservation.user, actor)) {
      throw new Error("No tienes permisos para cancelar esta reservación");
    }

    if (reservation.status === "cancelled") {
      throw new Error("La reservación ya fue cancelada");
    }

    if (reservation.status === "completed") {
      throw new Error("No se puede cancelar una reservación completada");
    }

    reservation.status = "cancelled";
    await reservation.save();

    return this.mapToResponseDTO(reservation);
  }

  /**
   * Confirm a reservation (admin)
   */
  static async confirm(id: string): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true },
    );

    if (!reservation) {
      throw new Error("Reservación no encontrada");
    }

    return this.mapToResponseDTO(reservation);
  }

  /**
   * Map to response DTO
   */
  private static mapToResponseDTO(
    reservation: any,
    pricing?: ReservationPricingDTO,
  ): ReservationResponseDTO {
    return {
      _id: reservation._id,
      user: reservation.user,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      notes: reservation.notes,
      status: reservation.status,
      location: reservation.location,
      pricing,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }
}
