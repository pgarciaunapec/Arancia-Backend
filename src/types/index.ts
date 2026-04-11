import { Request } from "express";
import { Types } from "mongoose";

// User types
export type UserRole = "customer" | "staff" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isVip: boolean;
  vipDiscount: number;
  vipSince?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// MenuItem types
export interface IMenuItem {
  _id: Types.ObjectId;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  description?: string;
  image: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Reservation types
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface IReservation {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: ReservationStatus;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type OrderStatus =
  | "cart"
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  ingredients?: string[];
}

export interface IShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
}

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: IShippingAddress;
  paymentStatus: PaymentStatus;
  isDelivery?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Contact types
export type ContactStatus = "new" | "read" | "responded" | "closed";

export interface IContact {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

// EventRequest types
export type EventRequestStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "cancelled";

export interface IEventRequest {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  packageName?: string;
  guests: number;
  preferredDate?: Date;
  notes?: string;
  status: EventRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Express extended types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: UserRole;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Payment types
export type PaymentMethod = "cash" | "card" | "transfer";
export type PaymentModelStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded";
export type TransactionType = "charge" | "refund";

export interface IPayment {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentModelStatus;
  reference: string;
  last4Digits?: string;
  cardHash?: string;
  transferReference?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  _id: Types.ObjectId;
  payment: Types.ObjectId;
  type: TransactionType;
  amount: number;
  status: PaymentModelStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Delivery types
export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed";

export interface IDeliveryOrder {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  user: Types.ObjectId;
  status: DeliveryStatus;
  deliveryAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  agent?: {
    name: string;
    phone: string;
  };
  estimatedMinutes: number;
  estimatedArrival?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Table types
export type TableStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface ITable {
  _id: Types.ObjectId;
  number: number;
  capacity: number;
  zone: string;
  status: TableStatus;
  activeBill?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// TableBill types
export type TableBillStatus = "open" | "closed" | "cancelled";

export interface ITableBillItem {
  menuItem: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface ITableBill {
  _id: Types.ObjectId;
  table: Types.ObjectId;
  waiter: Types.ObjectId;
  customer?: Types.ObjectId;
  items: ITableBillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: TableBillStatus;
  paymentMethod?: PaymentMethod;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// CashRegister types
export type CashRegisterStatus = "open" | "closed";

export interface ICashRegister {
  _id: Types.ObjectId;
  date: Date;
  status: CashRegisterStatus;
  openingBalance: number;
  closingBalance?: number;
  openedBy: Types.ObjectId;
  closedBy?: Types.ObjectId;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  transactionCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// InventoryItem types
export interface IInventoryItem {
  _id: Types.ObjectId;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  isActive: boolean;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}
