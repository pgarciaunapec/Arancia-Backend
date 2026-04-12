import mongoose, { Schema, Document } from "mongoose";
import { ITable } from "../types/index";

export interface ITableDocument extends Omit<ITable, "_id">, Document {}

const tableSchema = new Schema<ITableDocument>(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
      default: "Salón Principal",
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    assignedStaff: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    activeBill: {
      type: Schema.Types.ObjectId,
      ref: "TableBill",
    },
  },
  { timestamps: true },
);

export const Table = mongoose.model<ITableDocument>("Table", tableSchema);
