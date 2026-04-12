/**
 * Reservation Service
 * Handles reservation operations: create, update, retrieve, cancel
 */

import { Reservation } from "../models/Reservation";
import { Table } from "../models/Table";
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
  private static async assignAvailableTable(
    guests: number,
    excludeTableId?: string,
  ) {
    const query: Record<string, unknown> = {
      isActive: true,
      status: "available",
      capacity: { $gte: guests },
    };

    if (excludeTableId) {
      query._id = { $ne: excludeTableId };
    }

    return Table.findOne(query).sort({ capacity: 1, number: 1 });
  }

  static async getAvailability(guests?: number) {
    const query: Record<string, unknown> = {
      isActive: true,
      status: "available",
    };

    if (guests && Number.isFinite(guests) && guests > 0) {
      query.capacity = { $gte: guests };
    }

    return Table.find(query)
      .select("number capacity zone image description status")
      .sort({ capacity: 1, number: 1 })
      .lean();
  }

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
    const table = await this.assignAvailableTable(dto.guests);

    if (!table) {
      throw new Error(
        "No hay mesas disponibles para la cantidad de personas seleccionada.",
      );
    }

    const reservation = await Reservation.create({
      user: userId,
      table: table._id,
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

    table.status = "reserved";
    await table.save();

    await reservation.populate("table", "number zone capacity image");

    return this.mapToResponseDTO(reservation);
  }

  /**
   * Get reservation by ID
   */
  static async getById(id: string): Promise<ReservationResponseDTO> {
    const reservation = await Reservation.findById(id).populate(
      "table",
      "number zone capacity image",
    );
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
    const reservations = await Reservation.find({ user: userId })
      .populate("table", "number zone capacity image")
      .sort({ date: -1 });
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
      .populate("table", "number zone capacity image")
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
    })
      .populate("table", "number zone capacity image")
      .sort({ time: 1 });

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
      throw new Error(
        "Solo el personal puede cambiar el estado de la reservación",
      );
    }

    const nextGuests = dto.guests ?? reservation.guests;
    const previousTotal = reservation.guests * COVER_PRICE_PER_GUEST;
    const newTotal = nextGuests * COVER_PRICE_PER_GUEST;
    const delta = newTotal - previousTotal;

    const currentTable = reservation.table
      ? await Table.findById(reservation.table)
      : null;

    if (!currentTable || currentTable.capacity < nextGuests) {
      const replacementTable = await this.assignAvailableTable(
        nextGuests,
        currentTable?._id.toString(),
      );

      if (!replacementTable) {
        throw new Error(
          "No hay mesas disponibles para ajustar esta reservación con la nueva capacidad.",
        );
      }

      if (currentTable) {
        currentTable.status = "available";
        await currentTable.save();
      }

      replacementTable.status = "reserved";
      await replacementTable.save();
      reservation.table = replacementTable._id as any;
    }

    const isPaidReservation = reservation.status === "confirmed";

    if (isPaidReservation && delta > 0 && !dto.acceptAdditionalCharge) {
      throw new Error(
        `La reserva ya está pagada. Este ajuste requiere un cobro adicional de RD$${delta}. Confirma para continuar.`,
      );
    }

    const nextStatus = dto.status ?? reservation.status;

    const { acceptAdditionalCharge: _acceptAdditionalCharge, ...updates } = dto;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        (reservation as any)[key] = value;
      }
    }

    await reservation.save();

    if (nextStatus === "cancelled" || nextStatus === "completed") {
      if (reservation.table) {
        await Table.findByIdAndUpdate(reservation.table, {
          status: "available",
        });
      }
    } else if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: "reserved" });
    }

    await reservation.populate("table", "number zone capacity image");

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

    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: "available" });
    }

    await reservation.populate("table", "number zone capacity image");

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

    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: "reserved" });
      await reservation.populate("table", "number zone capacity image");
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
    let mappedTable: ReservationResponseDTO["table"];

    if (reservation.table) {
      if (typeof reservation.table === "object" && reservation.table.number) {
        mappedTable = {
          _id: String(reservation.table._id),
          number: Number(reservation.table.number),
          zone: reservation.table.zone || "General",
          capacity: Number(reservation.table.capacity || 0),
          image: reservation.table.image || undefined,
        };
      } else {
        mappedTable = String(reservation.table);
      }
    }

    return {
      _id: String(reservation._id),
      user: reservation.user ? String(reservation.user) : undefined,
      table: mappedTable,
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
