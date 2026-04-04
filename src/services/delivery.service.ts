import { DeliveryOrder } from "../models/DeliveryOrder";
import { IShippingAddress } from "../types/index";

export class DeliveryService {
  static async createFromOrder(
    orderId: string,
    userId: string,
    address: IShippingAddress,
  ) {
    const estimatedMinutes = 45;
    const estimatedArrival = new Date(
      Date.now() + estimatedMinutes * 60 * 1000,
    );

    return DeliveryOrder.create({
      order: orderId,
      user: userId,
      status: "pending",
      deliveryAddress: address,
      estimatedMinutes,
      estimatedArrival,
    });
  }

  static async getClientActiveDelivery(userId: string) {
    return DeliveryOrder.findOne({
      user: userId,
      status: { $in: ["pending", "assigned", "in_transit"] },
    })
      .populate("order", "total items status")
      .sort({ createdAt: -1 })
      .select("-agent.phone");
  }

  static async updateStatus(
    deliveryId: string,
    status: string,
    agentInfo?: { name: string; phone: string },
  ) {
    const update: Record<string, unknown> = { status };

    if (agentInfo) {
      update.agent = agentInfo;
    }

    if (status === "in_transit") {
      const estimatedMinutes = 30;
      update.estimatedArrival = new Date(
        Date.now() + estimatedMinutes * 60 * 1000,
      );
      update.estimatedMinutes = estimatedMinutes;
    }

    if (status === "delivered") {
      update.deliveredAt = new Date();
    }

    return DeliveryOrder.findByIdAndUpdate(deliveryId, update, { new: true });
  }
}
