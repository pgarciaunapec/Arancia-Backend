import express, { Application, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { specs } from "./config/swagger";
import { initializeSocketServer } from "./realtime/socket";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import menuRoutes from "./routes/menu.routes";
import reservationRoutes from "./routes/reservation.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import contactRoutes from "./routes/contact.routes";
import imageRoutes from "./routes/image.routes";
import paymentRoutes from "./routes/payment.routes";
import deliveryRoutes from "./routes/delivery.routes";
import invoiceRoutes from "./routes/invoice.routes";
import notificationRoutes from "./routes/notification.routes";
import adminUserRoutes from "./routes/admin/user.routes";
import adminTableRoutes from "./routes/admin/table.routes";
import adminCollectionsRoutes from "./routes/admin/collections.routes";
import adminTableBillRoutes from "./routes/admin/tableBill.routes";
import adminCashRegisterRoutes from "./routes/admin/cashRegister.routes";
import adminInventoryRoutes from "./routes/admin/inventory.routes";
import adminDashboardRoutes from "./routes/admin/dashboard.routes";
import adminOrderRoutes from "./routes/admin/order.routes";
import adminDeliveryRoutes from "./routes/admin/delivery.routes";
import adminFleetRoutes from "./routes/admin/fleet.routes";
import adminInvoiceRoutes from "./routes/admin/invoice.routes";
import adminAuditRoutes from "./routes/admin/audit.routes";

export const createApp = (): Application => {
  const app: Application = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin image loading
    }),
  );
  app.use(mongoSanitize());
  const allowedOrigins = Array.isArray(env.frontendOrigins)
    ? env.frontendOrigins
    : [env.frontendUrl];

  // Normalize allowed hostnames so we accept the same hostname with http/https/any-port
  const allowedHostnames = allowedOrigins.map((o) => {
    try {
      return new URL(o).hostname;
    } catch {
      return o.replace(/^https?:\/\//, "").split(":")[0];
    }
  });

  // In development allow any origin to simplify local testing.
  if (env.nodeEnv !== "production") {
    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
  } else {
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true); // allow non-browser or same-origin requests
          // Allow exact matches
          if (allowedOrigins.includes(origin)) return callback(null, true);
          // Allow match by hostname (handles http vs https differences)
          try {
            const originHost = new URL(origin).hostname;
            if (allowedHostnames.includes(originHost)) return callback(null, true);
          } catch {
            // ignore parse errors
          }
          // Don't throw an Error here (would trigger 500). Signal disallowed origin.
          return callback(null, false);
        },
        credentials: true,
      }),
    );
  }
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  if (env.nodeEnv !== "production") {
    app.get("/api/test/error", () => {
      throw new Error("forced test error");
    });
  }

  // Swagger Documentation
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customCss: ".topbar { display: none }",
    }),
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/reservations", reservationRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/delivery", deliveryRoutes);
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/notifications", notificationRoutes);

  // Admin routes
  app.use("/api/admin/users", adminUserRoutes);
  app.use("/api/admin/tables", adminTableRoutes);
  app.use("/api/admin/collections", adminCollectionsRoutes);
  app.use("/api/admin/table-bills", adminTableBillRoutes);
  app.use("/api/admin/cash-register", adminCashRegisterRoutes);
  app.use("/api/admin/inventory", adminInventoryRoutes);
  app.use("/api/admin/dashboard", adminDashboardRoutes);
  app.use("/api/admin/orders", adminOrderRoutes);
  app.use("/api/admin/delivery", adminDeliveryRoutes);
  app.use("/api/admin/fleet", adminFleetRoutes);
  app.use("/api/admin/invoices", adminInvoiceRoutes);
  app.use("/api/admin/audit", adminAuditRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Error interno del servidor",
      message: env.nodeEnv === "development" ? err.message : undefined,
    });
  });

  return app;
};

export const app = createApp();

// Start server
export const startServer = async () => {
  await connectDatabase();

  const httpServer = createServer(app);
  initializeSocketServer(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
    console.log(`📝 Ambiente: ${env.nodeEnv}`);
    console.log(
      `📚 Documentación Swagger: http://localhost:${env.port}/api/docs`,
    );
  });

  return httpServer;
};

/* c8 ignore start */
if (env.nodeEnv !== "test") {
  void startServer();
}
/* c8 ignore stop */

export default app;
