import mongoose, { Schema, Document } from "mongoose";
import { ITableBill } from "../types/index";

export interface ITableBillDocument extends Omit<ITableBill, "_id">, Document {}

const tableBillItemSchema = new Schema(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const tableBillSchema = new Schema<ITableBillDocument>(
  {
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    waiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [tableBillItemSchema],
      default: [],
    },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
    },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

tableBillSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    this.tax = this.subtotal * 0.18;
    this.total = this.subtotal - this.discount + this.tax;
  }
  next();
});

export const TableBill = mongoose.model<ITableBillDocument>(
  "TableBill",
  tableBillSchema,
);
