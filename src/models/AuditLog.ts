import mongoose, { Schema, Types } from "mongoose";

export interface IAuditDiff {
  before?: unknown;
  after?: unknown;
}

export interface IAuditMeta {
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "import"
  | "bulk-update"
  | "bulk-delete";

export interface IAuditLog {
  userId?: Types.ObjectId;
  userEmail: string;
  action: AuditAction;
  collection: string;
  docId?: string;
  timestamp: Date;
  diff?: IAuditDiff;
  meta?: IAuditMeta;
  createdAt: Date;
  updatedAt: Date;
}

export type IAuditLogDocument = mongoose.HydratedDocument<IAuditLog>;

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId },
    userEmail: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "import",
        "bulk-update",
        "bulk-delete",
      ],
    },
    collection: { type: String, required: true, index: true },
    docId: { type: String, index: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    diff: {
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },
    meta: {
      ip: { type: String },
      userAgent: { type: String },
      requestId: { type: String },
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
);

AuditLogSchema.index({ collection: 1, docId: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>(
  "AuditLog",
  AuditLogSchema,
  "audit_logs",
);
