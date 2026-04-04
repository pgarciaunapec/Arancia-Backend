import mongoose, { Schema, Document } from "mongoose";
import { IPayment } from "../types/index";

export interface IPaymentDocument extends Omit<IPayment, "_id">, Document {}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    last4Digits: {
      type: String,
    },
    cardHash: {
      type: String,
      select: false,
    },
    transferReference: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPaymentDocument>(
  "Payment",
  paymentSchema,
);
