import mongoose, { Schema, Document } from "mongoose";
import { IInventoryItem } from "../types/index";

export interface IInventoryItemDocument
  extends Omit<IInventoryItem, "_id">, Document {
  isLowStock: boolean;
}

const inventoryItemSchema = new Schema<IInventoryItemDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

inventoryItemSchema.virtual("isLowStock").get(function () {
  return this.currentStock <= this.minimumStock;
});

export const InventoryItem = mongoose.model<IInventoryItemDocument>(
  "InventoryItem",
  inventoryItemSchema,
);
