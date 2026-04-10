import mongoose, { Schema, Document } from "mongoose";
import { IDeliveryOrder } from "../types/index";

export interface IDeliveryOrderDocument
  extends Omit<IDeliveryOrder, "_id">, Document {}

const deliveryOrderSchema = new Schema<IDeliveryOrderDocument>(
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
    status: {
      type: String,
      enum: ["pending", "assigned", "in_transit", "delivered", "failed"],
      default: "pending",
    },
    deliveryAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
    agent: {
      name: { type: String },
      phone: { type: String },
    },
    estimatedMinutes: {
      type: Number,
      default: 45,
    },
    estimatedArrival: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

export const DeliveryOrder = mongoose.model<IDeliveryOrderDocument>(
  "DeliveryOrder",
  deliveryOrderSchema,
);
