import mongoose, { Schema } from "mongoose";

export interface IFieldValidatorConfig {
  pattern?: string;
  min?: number;
  max?: number;
  customValidatorId?: string;
}

export interface IFieldReferenceConfig {
  collection: string;
  displayField: string;
}

export interface IFieldConfig {
  name: string;
  label?: string;
  visible?: boolean;
  editable?: boolean;
  type?: string;
  order?: number;
  required?: boolean;
  enumOptions?: string[];
  reference?: IFieldReferenceConfig;
  validators?: IFieldValidatorConfig;
}

export interface IRolePermissionConfig {
  read?: boolean;
  write?: boolean;
  delete?: boolean;
}

export interface IListDefaults {
  pageSize?: number;
  defaultSort?: Record<string, number>;
}

export interface IAdminConfig {
  collection: string;
  fields: IFieldConfig[];
  listDefaults?: IListDefaults;
  permissions?: Record<string, IRolePermissionConfig>;
  createdAt: Date;
  updatedAt: Date;
}

export type IAdminConfigDocument = mongoose.HydratedDocument<IAdminConfig>;

const FieldSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    label: { type: String },
    visible: { type: Boolean, default: true },
    editable: { type: Boolean, default: true },
    type: { type: String, default: "string" },
    order: { type: Number, default: 0 },
    required: { type: Boolean, default: false },
    enumOptions: { type: [String], default: undefined },
    reference: {
      collection: { type: String },
      displayField: { type: String },
    },
    validators: {
      pattern: { type: String },
      min: { type: Number },
      max: { type: Number },
      customValidatorId: { type: String },
    },
  },
  { _id: false },
);

const AdminConfigSchema: Schema = new Schema(
  {
    collection: { type: String, required: true, unique: true },
    fields: { type: [FieldSchema], default: [] },
    listDefaults: {
      pageSize: { type: Number, default: 20 },
      defaultSort: { type: Schema.Types.Mixed, default: { _id: -1 } },
    },
    permissions: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  },
);

export default mongoose.model<IAdminConfig>("AdminConfig", AdminConfigSchema);
