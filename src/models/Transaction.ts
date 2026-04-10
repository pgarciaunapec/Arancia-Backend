import mongoose, { Schema, Document } from "mongoose";
import { ITransaction } from "../types/index";

export interface ITransactionDocument
  extends Omit<ITransaction, "_id">, Document {}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["charge", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model<ITransactionDocument>(
  "Transaction",
  transactionSchema,
);
