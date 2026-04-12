import mongoose, { Schema, Document } from "mongoose";
import { IReservation, ReservationStatus } from "../types/index";

export interface IReservationDocument
  extends Omit<IReservation, "_id">, Document {}

const reservationSchema = new Schema<IReservationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida"],
    },
    time: {
      type: String,
      required: [true, "La hora es requerida"],
    },
    guests: {
      type: Number,
      required: [true, "El número de personas es requerido"],
      min: [1, "Debe haber al menos 1 persona"],
      max: [20, "Máximo 20 personas por reservación"],
    },
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Las notas no pueden exceder 500 caracteres"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ] as ReservationStatus[],
      default: "pending",
    },
    location: {
      type: String,
      default: "Restaurante Principal",
    },
  },
  {
    timestamps: true,
  },
);

// Index for querying by user and date
reservationSchema.index({ user: 1, date: -1 });
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ table: 1, date: 1, time: 1 });

export const Reservation = mongoose.model<IReservationDocument>(
  "Reservation",
  reservationSchema,
);
