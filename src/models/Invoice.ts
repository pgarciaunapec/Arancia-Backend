import mongoose, { Schema, Document } from "mongoose";
import { IInvoice, InvoiceKind, PaymentMethod } from "../types/index";

export interface IInvoiceDocument extends Omit<IInvoice, "_id">, Document {}

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    kind: {
      type: String,
      enum: ["order", "table_bill"] as InvoiceKind[],
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      sparse: true,
      index: true,
      unique: true,
    },
    tableBill: {
      type: Schema.Types.ObjectId,
      ref: "TableBill",
      sparse: true,
      index: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"] as PaymentMethod[],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "DOP",
    },
    qrPayload: {
      type: String,
      required: true,
    },
    qrImageDataUrl: {
      type: String,
      required: true,
    },
    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

invoiceSchema.index({ user: 1, createdAt: -1 });

export const Invoice = mongoose.model<IInvoiceDocument>("Invoice", invoiceSchema);
