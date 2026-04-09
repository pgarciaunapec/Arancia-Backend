import mongoose, { Schema, Document } from "mongoose";
import { ICashRegister } from "../types/index";

export interface ICashRegisterDocument
  extends Omit<ICashRegister, "_id">, Document {}

const cashRegisterSchema = new Schema<ICashRegisterDocument>(
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    openingBalance: {
      type: Number,
      required: true,
      min: 0,
    },
    closingBalance: {
      type: Number,
    },
    openedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalSales: { type: Number, default: 0 },
    totalCash: { type: Number, default: 0 },
    totalCard: { type: Number, default: 0 },
    totalTransfer: { type: Number, default: 0 },
    transactionCount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true },
);

// Prevent multiple open registers per day
cashRegisterSchema.index(
  { date: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "open" } },
);

export const CashRegister = mongoose.model<ICashRegisterDocument>(
  "CashRegister",
  cashRegisterSchema,
);
