import { DeliveryOrder } from "../models/DeliveryOrder";
import { User } from "../models/User";
import { IShippingAddress } from "../types/index";

type DeliveryAssignmentOptions = {
  agentInfo?: { name: string; phone: string };
  assignedTo?: string;
  vehicleId?: string;
};

export class DeliveryService {
  static async createFromOrder(
    orderId: string,
    userId: string,
    address: IShippingAddress,
    options?: DeliveryAssignmentOptions,
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
      assignedTo: options?.assignedTo,
      vehicle: options?.vehicleId,
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
    options?: DeliveryAssignmentOptions,
  ) {
    const update: Record<string, unknown> = { status };

    if (options?.assignedTo) {
      update.assignedTo = options.assignedTo;
    }

    if (options?.vehicleId) {
      update.vehicle = options.vehicleId;
    }

    if (options?.agentInfo) {
      update.agent = options.agentInfo;
    } else if (options?.assignedTo) {
      const staff = await User.findById(options.assignedTo)
        .select("name phone")
        .lean();
      if (staff) {
        update.agent = {
          name: staff.name || "Repartidor",
          phone: staff.phone || "",
        };
      }
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
