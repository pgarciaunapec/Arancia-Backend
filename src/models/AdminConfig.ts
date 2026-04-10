import mongoose, { Document, Schema } from "mongoose";

export interface IFieldConfig {
  name: string;
  label?: string;
  visible?: boolean;
  editable?: boolean;
  type?: string;
  order?: number;
}

export interface IAdminConfigDocument extends Document {
  collection: string;
  fields: IFieldConfig[];
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    label: { type: String },
    visible: { type: Boolean, default: true },
    editable: { type: Boolean, default: true },
    type: { type: String, default: "string" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const AdminConfigSchema: Schema = new Schema(
  {
    collection: { type: String, required: true, unique: true },
    fields: { type: [FieldSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<IAdminConfigDocument>(
  "AdminConfig",
  AdminConfigSchema,
);
