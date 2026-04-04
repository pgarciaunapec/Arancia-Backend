/**
 * Order DTOs - Data Transfer Objects for Orders
 */

// Request DTOs
export interface CreateOrderRequestDTO {
  items: OrderItemInputDTO[];
  shippingAddress?: ShippingAddressDTO;
  isDelivery?: boolean;
}

export interface OrderItemInputDTO {
  menuItem: string;
  quantity: number;
}

export interface ShippingAddressDTO {
  name: string;
  address: string;
  city: string;
  zip: string;
}

export interface UpdateOrderStatusRequestDTO {
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
}

// Response DTOs
export interface OrderResponseDTO {
  _id: string;
  user: string;
  items: OrderItemResponseDTO[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  isDelivery?: boolean;
  shippingAddress?: ShippingAddressDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemResponseDTO {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderListResponseDTO {
  success: boolean;
  count: number;
  data: OrderResponseDTO[];
}
