/**
 * Order Service
 * Handles order operations: create, update, retrieve, calculate totals
 */

import { Order } from "../models/Order";
import { DeliveryOrder } from "../models/DeliveryOrder";
import { MenuItem } from "../models/MenuItem";
import { Notification } from "../models/Notification";
import { Payment } from "../models/Payment";
import { Transaction } from "../models/Transaction";
import { DeliveryService } from "./delivery.service";
import { PaymentService } from "./payment.service";
import { InvoiceService } from "./invoice.service";
import {
  CreateOrderRequestDTO,
  OrderResponseDTO,
  UpdateOrderStatusRequestDTO,
} from "../dtos/index";
import { emitOrderStatusUpdated } from "../realtime/socket";

export class OrderService {
  /**
   * Create a new order
   */
  static async create(
    userId: string,
    dto: CreateOrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    // Validate items exist
    const itemIds = dto.items.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

    if (menuItems.length !== itemIds.length) {
      throw new Error("Uno o más artículos no existen");
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = dto.items.map((item) => {
      const menuItem = menuItems.find(
        (mi) => mi._id.toString() === item.menuItem,
      );
      if (!menuItem) throw new Error("Artículo no encontrado");
      subtotal += menuItem.price * item.quantity;
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        description: menuItem.description,
        ingredients: Array.isArray(menuItem.ingredients)
          ? menuItem.ingredients
          : [],
      };
    });

    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% ITBIS
    const total = subtotal + tax;

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: "pending",
      paymentStatus: "pending",
      isDelivery: dto.isDelivery,
      shippingAddress: dto.shippingAddress,
    });

    if (dto.payment?.method) {
      if (!PaymentService.validatePaymentMethod(dto.payment.method)) {
        throw new Error("Método de pago inválido");
      }

      if (dto.payment.method === "card" && !dto.payment.cardNumber) {
        throw new Error(
          "El número de tarjeta es requerido para pagar con tarjeta",
        );
      }

      const reference = await PaymentService.generateReference();
      const paymentData: Record<string, unknown> = {
        order: order._id,
        user: userId,
        amount: order.total,
        method: dto.payment.method,
        reference,
        status: "completed",
      };

      if (dto.payment.method === "card" && dto.payment.cardNumber) {
        paymentData.last4Digits = PaymentService.getLast4Digits(
          dto.payment.cardNumber,
        );
        paymentData.cardHash = await PaymentService.hashCardNumber(
          dto.payment.cardNumber,
        );
      }

      if (dto.payment.method === "transfer" && dto.payment.transferReference) {
        paymentData.transferReference = dto.payment.transferReference;
      }

      const payment = await Payment.create(paymentData);

      await Transaction.create({
        payment: payment._id,
        type: "charge",
        amount: order.total,
        status: "completed",
        metadata: {
          method: dto.payment.method,
          reference,
        },
      });

      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();

      if (order.isDelivery && order.shippingAddress) {
        await DeliveryService.createFromOrder(
          order._id.toString(),
          userId,
          order.shippingAddress,
        );
      }

      await InvoiceService.createFromOrderPayment(order, payment);
    }

    emitOrderStatusUpdated({
      orderId: order._id.toString(),
      status: order.status,
      updatedAt: new Date(order.updatedAt || Date.now()).toISOString(),
      userId,
    });

    return this.mapToResponseDTO(order);
  }

  /**
   * Get order by ID
   */
  static async getById(id: string): Promise<OrderResponseDTO> {
    const order = await Order.findById(id).populate("user", "name email phone");
    if (!order) {
      throw new Error("Orden no encontrada");
    }
    return this.mapToResponseDTO(order);
  }

  /**
   * Get all orders for a user
   */
  static async getUserOrders(userId: string): Promise<OrderResponseDTO[]> {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return orders.map((order) => this.mapToResponseDTO(order));
  }

  /**
   * Get all orders (admin)
   */
  static async getAll(
    skip: number = 0,
    limit: number = 10,
  ): Promise<{
    data: OrderResponseDTO[];
    total: number;
  }> {
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    return {
      data: orders.map((order) => this.mapToResponseDTO(order)),
      total,
    };
  }

  /**
   * Update order status
   */
  static async updateStatus(
    id: string,
    dto: UpdateOrderStatusRequestDTO,
  ): Promise<OrderResponseDTO> {
    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    const previousStatus = order.status;

    if (
      dto.status === "shipped" &&
      previousStatus !== "shipped" &&
      order.isDelivery &&
      order.shippingAddress &&
      !dto.deliveryAgentId
    ) {
      throw new Error(
        "Debes seleccionar un repartidor antes de enviar el pedido.",
      );
    }

    order.status = dto.status;

    if (dto.deliveryAgentId) {
      order.assignedStaff = dto.deliveryAgentId as any;
    }

    if (dto.vehicleId) {
      order.assignedVehicle = dto.vehicleId as any;
    }

    await order.save();

    if (dto.status === "shipped" && previousStatus !== "shipped") {
      const orderCode = order._id.toString().slice(-8).toUpperCase();

      if (order.isDelivery && order.shippingAddress) {
        const existingDelivery = await DeliveryOrder.findOne({
          order: order._id,
        });

        if (existingDelivery) {
          await DeliveryService.updateStatus(
            existingDelivery._id.toString(),
            "in_transit",
            {
              assignedTo: dto.deliveryAgentId,
              vehicleId: dto.vehicleId,
            },
          );
        } else {
          const createdDelivery = await DeliveryService.createFromOrder(
            order._id.toString(),
            String(order.user),
            order.shippingAddress,
            {
              assignedTo: dto.deliveryAgentId,
              vehicleId: dto.vehicleId,
            },
          );

          await DeliveryService.updateStatus(
            createdDelivery._id.toString(),
            "in_transit",
            {
              assignedTo: dto.deliveryAgentId,
              vehicleId: dto.vehicleId,
            },
          );
        }
      }

      await Notification.create({
        user: order.user,
        order: order._id,
        type: "order_status",
        title: "Tu pedido fue enviado",
        message: `Tu pedido #${orderCode} salió y va en camino.`,
        metadata: {
          status: dto.status,
        },
      });
    }

    if (dto.status === "delivered") {
      await DeliveryOrder.findOneAndUpdate(
        { order: order._id },
        {
          status: "delivered",
          deliveredAt: new Date(),
        },
      );
    }

    emitOrderStatusUpdated({
      orderId: order._id.toString(),
      status: order.status,
      updatedAt: new Date(order.updatedAt || Date.now()).toISOString(),
      userId: String(order.user),
    });

    return this.mapToResponseDTO(order);
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    id: string,
    paymentStatus: string,
  ): Promise<OrderResponseDTO> {
    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true },
    );

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    return this.mapToResponseDTO(order);
  }

  /**
   * Cancel an order
   */
  static async cancel(id: string): Promise<OrderResponseDTO> {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Orden no encontrada");
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      throw new Error("No se puede cancelar una orden en este estado");
    }

    order.status = "cancelled";
    await order.save();

    emitOrderStatusUpdated({
      orderId: order._id.toString(),
      status: order.status,
      updatedAt: new Date(order.updatedAt || Date.now()).toISOString(),
      userId: String(order.user),
    });

    return this.mapToResponseDTO(order);
  }

  /**
   * Map to response DTO
   */
  private static mapToResponseDTO(order: any): OrderResponseDTO {
    return {
      _id: order._id,
      user: order.user?._id || order.user,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      isDelivery: order.isDelivery,
      shippingAddress: order.shippingAddress,
      assignedStaff: order.assignedStaff
        ? String(order.assignedStaff._id || order.assignedStaff)
        : undefined,
      assignedTable: order.assignedTable
        ? String(order.assignedTable._id || order.assignedTable)
        : undefined,
      assignedVehicle: order.assignedVehicle
        ? String(order.assignedVehicle._id || order.assignedVehicle)
        : undefined,
      assignmentNotes: order.assignmentNotes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
