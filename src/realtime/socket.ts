import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "../config/env";

export type OrderStatusUpdatedEvent = {
  orderId: string;
  status: string;
  updatedAt: string;
  userId?: string;
};

const ADMIN_ROOM = "orders:admin";
const ORDER_ROOM_PREFIX = "order";
const USER_ROOM_PREFIX = "user";

let io: SocketIOServer | null = null;

const getOrderRoom = (orderId: string) => `${ORDER_ROOM_PREFIX}:${orderId}`;
const getUserRoom = (userId: string) => `${USER_ROOM_PREFIX}:${userId}`;

type OrderSubscriptionPayload = {
  orderId?: string;
  userId?: string;
  adminScope?: boolean;
};

const parseOrigins = (): string[] => {
  const configured = Array.isArray(env.frontendOrigins)
    ? env.frontendOrigins
    : [env.frontendUrl];
  return configured.filter(Boolean);
};

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) {
    return true;
  }

  const allowedOrigins = parseOrigins();
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  const allowedHostnames = allowedOrigins.map((value) => {
    try {
      return new URL(value).hostname;
    } catch {
      return value.replace(/^https?:\/\//, "").split(":")[0];
    }
  });

  try {
    const hostname = new URL(origin).hostname;
    return allowedHostnames.includes(hostname);
  } catch {
    return false;
  }
};

export const initializeSocketServer = (
  httpServer: HttpServer,
): SocketIOServer => {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors:
      env.nodeEnv !== "production"
        ? {
            origin: true,
            credentials: true,
          }
        : {
            origin: (origin, callback) => {
              callback(null, isAllowedOrigin(origin));
            },
            credentials: true,
          },
  });

  io.on("connection", (socket) => {
    socket.on("orders:subscribe", (payload?: OrderSubscriptionPayload) => {
      if (!payload) {
        return;
      }

      if (payload.orderId) {
        socket.join(getOrderRoom(payload.orderId));
      }

      if (payload.userId) {
        socket.join(getUserRoom(payload.userId));
      }

      if (payload.adminScope) {
        socket.join(ADMIN_ROOM);
      }
    });
  });

  return io;
};

export const emitOrderStatusUpdated = (event: OrderStatusUpdatedEvent): void => {
  if (!io) {
    return;
  }

  io.to(getOrderRoom(event.orderId)).emit("orders:status-updated", event);

  if (event.userId) {
    io.to(getUserRoom(event.userId)).emit("orders:status-updated", event);
  }

  io.to(ADMIN_ROOM).emit("orders:status-updated", event);
};
