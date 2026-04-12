import mongoose, { Schema, Document } from "mongoose";
import { IVehicle, VehicleStatus, VehicleType } from "../types/index";

export interface IVehicleDocument extends Omit<IVehicle, "_id">, Document {}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    plate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["motorbike", "car", "van", "bicycle"] as VehicleType[],
      required: true,
      default: "motorbike",
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    capacityOrders: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: [
        "available",
        "in_use",
        "maintenance",
        "inactive",
      ] as VehicleStatus[],
      default: "available",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true },
);
export const Vehicle = mongoose.model<IVehicleDocument>(
  "Vehicle",
  vehicleSchema,
);
