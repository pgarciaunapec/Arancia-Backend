import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, ISavedAddress, ISavedCard } from "../types/index";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const savedAddressSchema = new Schema<ISavedAddress>(
  {
    label: {
      type: String,
      trim: true,
      default: "Mi dirección",
    },
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "La dirección es requerida"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
      default: "00000",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const savedCardSchema = new Schema<ISavedCard>(
  {
    label: {
      type: String,
      trim: true,
      default: "Mi tarjeta",
    },
    last4: {
      type: String,
      required: true,
      trim: true,
    },
    cardType: {
      type: String,
      enum: ["visa", "mastercard", "other"],
      default: "other",
    },
    expiryMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    cardHash: {
      type: String,
      select: false,
    },
  },
  { _id: true },
);

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un email válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    savedAddresses: [savedAddressSchema],
    savedCards: [savedCardSchema],
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
      index: true,
    },
    isVip: { type: Boolean, default: false },
    vipDiscount: { type: Number, default: 0, min: 0, max: 50 },
    vipSince: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
