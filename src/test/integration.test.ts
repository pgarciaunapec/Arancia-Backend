import request from "supertest";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";

import { app } from "../server";
import { connectDatabase } from "../config/database";
import { User, MenuItem, Reservation } from "../models";

/**
 * Integration tests using the MongoDB URI from the env config.
 * These tests simulate frontend flows via HTTP (supertest) and
 * validate DB state directly when necessary.
 */
describe("Integration tests (real DB) - Full flows", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  beforeEach(async () => {
    // Clear all collections to keep tests isolated
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("auth register & login, create order, update payment and cancel", async () => {
    // Create a menu item directly in DB (admin endpoint requires admin auth)
    const menu = await MenuItem.create({
      name: "Test Dish",
      category: "Main",
      price: 10,
      image: "http://example.com/dish.jpg",
    });

    // Register user
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "testuser+1@example.com", password: "password123" })
      .expect(201);

    expect(registerRes.body.success).toBe(true);
    const token = registerRes.body.data.token;
    expect(token).toBeTruthy();

    // Login (validate login flow too)
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser+1@example.com", password: "password123" })
      .expect(200);

    expect(loginRes.body.success).toBe(true);
    const loginToken = loginRes.body.data.token;
    expect(loginToken).toBeTruthy();

    const authHeader = `Bearer ${loginToken}`;

    // Create order using the real flow
    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", authHeader)
      .send({ items: [{ menuItem: menu._id.toString(), quantity: 2 }] })
      .expect(201);

    expect(orderRes.body.success).toBe(true);
    const order = orderRes.body.data;
    expect(order.subtotal).toBe(20);
    expect(order.tax).toBeCloseTo(3.6, 2);
    expect(order.total).toBeCloseTo(23.6, 2);

    // Update payment status
    const paymentRes = await request(app)
      .put(`/api/orders/${order._id}/payment-status`)
      .set("Authorization", authHeader)
      .send({ paymentStatus: "paid" })
      .expect(200);

    expect(paymentRes.body.success).toBe(true);
    expect(paymentRes.body.data.paymentStatus).toBe("paid");

    // Cancel the order (allowed while pending)
    const cancelRes = await request(app)
      .post(`/api/orders/${order._id}/cancel`)
      .set("Authorization", authHeader)
      .send()
      .expect(200);

    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.status).toBe("cancelled");

    // Cancel again should return an error
    const cancelAgain = await request(app)
      .post(`/api/orders/${order._id}/cancel`)
      .set("Authorization", authHeader)
      .send()
      .expect(400);

    expect(cancelAgain.body.success).toBe(false);
    expect(cancelAgain.body.error).toMatch(/No se puede cancelar/);
  });

  it("reservations and my-reservations for authenticated user", async () => {
    // Register user
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Res User", email: "resuser@example.com", password: "password123" })
      .expect(201);
    const token = reg.body.data.token;
    const authHeader = `Bearer ${token}`;

    // Create a guest reservation via API
    const guestPayload = {
      date: new Date().toISOString(),
      time: "19:00",
      guests: 4,
      name: "Guest Person",
      email: "guest@example.com",
      phone: "555-1234",
    };

    const guestRes = await request(app).post("/api/reservations").send(guestPayload).expect(201);
    expect(guestRes.body.success).toBe(true);
    expect(guestRes.body.data.name).toBe("Guest Person");

    // Create a reservation tied to the authenticated user directly in DB
    const user = await User.findOne({ email: "resuser@example.com" });
    const userReservation = await Reservation.create({
      date: new Date(),
      time: "20:00",
      guests: 2,
      name: "Res User",
      email: user?.email,
      phone: "555-5678",
      user: user?._id,
    });

    // Fetch my-reservations (requires auth)
    const myRes = await request(app).get("/api/reservations/my-reservations").set("Authorization", authHeader).expect(200);
    expect(myRes.body.success).toBe(true);
    const data = myRes.body.data;
    expect(Array.isArray(data)).toBe(true);
    const found = data.find((r: any) => r._id === userReservation._id.toString());
    expect(found).toBeTruthy();
  });

  it("contact event-quote creation and validation error cases", async () => {
    const eventPayload = {
      name: "Client A",
      email: "clienta@example.com",
      phone: "555-0000",
      eventType: "social",
      packageName: "Esencial",
      guests: 50,
      preferredDate: new Date().toISOString(),
      notes: "Please include vegetarian options",
    };

    const evRes = await request(app).post("/api/contact/event-quote").send(eventPayload).expect(201);
    expect(evRes.body.success).toBe(true);
    expect(evRes.body.data.email).toBe("clienta@example.com");

    // Invalid payload -> validation error
    const invalid = await request(app).post("/api/contact/event-quote").send({ name: "X" }).expect(400);
    expect(invalid.body.success).toBe(false);
    expect(invalid.body.error).toBeDefined();
  });

  it("negative cases: invalid menu item in order and unauthorized access", async () => {
    // Register user
    const reg = await request(app).post("/api/auth/register").send({ name: "Neg User", email: "neguser@example.com", password: "password123" }).expect(201);
    const token = reg.body.data.token;
    const authHeader = `Bearer ${token}`;

    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).post("/api/orders").set("Authorization", authHeader).send({ items: [{ menuItem: fakeId, quantity: 1 }] }).expect(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Uno o más artículos no existen/);

    // Protected endpoint without token
    await request(app).get("/api/reservations/my-reservations").expect(401);
  });
});
