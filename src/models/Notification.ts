import mongoose, { Schema, Document } from "mongoose";
import { INotification, NotificationType } from "../types/index";

export interface INotificationDocument
  extends Omit<INotification, "_id">, Document {}

const notificationSchema = new Schema<INotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },
    type: {
      type: String,
      enum: ["order_status", "system"] as NotificationType[],
      default: "order_status",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>(
  "Notification",
  notificationSchema,
);
