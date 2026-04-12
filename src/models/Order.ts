import mongoose, { Schema, Document } from "mongoose";
import { IOrder, OrderStatus, PaymentStatus } from "../types/index";

export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const orderItemSchema = new Schema(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "La cantidad mínima es 1"],
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "cart",
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "shipped",
        "delivered",
        "cancelled",
      ] as OrderStatus[],
      default: "cart",
    },
    shippingAddress: {
      type: shippingAddressSchema,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"] as PaymentStatus[],
      default: "pending",
    },
    isDelivery: {
      type: Boolean,
      default: false,
    },
    assignedStaff: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    assignedTable: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      index: true,
    },
    assignedVehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      index: true,
    },
    assignmentNotes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate totals before saving
orderSchema.pre("save", function (this: IOrderDocument, next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );
    this.tax = this.subtotal * 0.18; // 18% tax
    this.total = this.subtotal + this.tax;
  }
  next();
});

export const Order = mongoose.model<IOrderDocument>("Order", orderSchema);
