import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant01 API",
      version: "1.0.0",
      description:
        "API completa para el sistema de gestión de Restaurant01. Incluye endpoints para clientes, administración, pagos y entregas.",
      contact: {
        name: "Restaurant01 Team",
        email: "contact@restaurant01.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: "Servidor de desarrollo",
      },
      {
        url: "https://api.restaurant01.com/api",
        description: "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresar JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            fullName: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["user", "admin", "staff"] },
            address: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            image: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            available: { type: "boolean" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            userId: { type: "string", format: "ObjectId" },
            items: { type: "array", items: { type: "object" } },
            totalPrice: { type: "number" },
            tax: { type: "number" },
            subtotal: { type: "number" },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "delivering",
                "delivered",
                "cancelled",
              ],
            },
            isDelivery: { type: "boolean" },
            deliveryAddress: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Reservation: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            userId: { type: "string", format: "ObjectId" },
            date: { type: "string", format: "date" },
            time: { type: "string" },
            guests: { type: "integer", minimum: 1, maximum: 20 },
            notes: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            orderId: { type: "string", format: "ObjectId" },
            userId: { type: "string", format: "ObjectId" },
            amount: { type: "number" },
            method: { type: "string", enum: ["cash", "card", "transfer"] },
            status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
            },
            reference: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Table: {
          type: "object",
          properties: {
            _id: { type: "string", format: "ObjectId" },
            number: { type: "integer" },
            capacity: { type: "integer", minimum: 1, maximum: 20 },
            zone: { type: "string" },
            status: {
              type: "string",
              enum: ["available", "occupied", "reserved", "maintenance"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [],
  },
  apis: [
    "./src/routes/auth.routes.ts",
    "./src/routes/user.routes.ts",
    "./src/routes/menu.routes.ts",
    "./src/routes/reservation.routes.ts",
    "./src/routes/order.routes.ts",
    "./src/routes/payment.routes.ts",
    "./src/routes/delivery.routes.ts",
    "./src/routes/admin/user.routes.ts",
    "./src/routes/admin/table.routes.ts",
    "./src/routes/admin/tableBill.routes.ts",
    "./src/routes/admin/cashRegister.routes.ts",
    "./src/routes/admin/inventory.routes.ts",
    "./src/routes/admin/dashboard.routes.ts",
    "./src/routes/admin/order.routes.ts",
    "./src/routes/admin/delivery.routes.ts",
  ],
};

export const specs = swaggerJsdoc(options);
