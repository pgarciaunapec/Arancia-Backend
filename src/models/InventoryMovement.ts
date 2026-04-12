import mongoose, { Schema, Document } from "mongoose";
import { IInventoryMovement, InventoryMovementAction } from "../types/index";

export interface IInventoryMovementDocument
  extends Omit<IInventoryMovement, "_id">, Document {}

const inventoryMovementSchema = new Schema<IInventoryMovementDocument>(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "create",
        "restock",
        "adjustment_in",
        "adjustment_out",
        "deactivate",
      ] as InventoryMovementAction[],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },
    newStock: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

inventoryMovementSchema.index({ item: 1, createdAt: -1 });

export const InventoryMovement = mongoose.model<IInventoryMovementDocument>(
  "InventoryMovement",
  inventoryMovementSchema,
);
