import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../server";
import { env } from "../config/env";
import { User } from "../models/User";
import {
  clearMongoMemory,
  connectMongoMemory,
  disconnectMongoMemory,
} from "../test/mongodb-memory";

const uploadDir = path.resolve(process.cwd(), "uploads", "admin");

describe("admin collections routes", () => {
  let token = "";

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const createAdminUserAndToken = async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "secret123",
      role: "admin",
    });

    token = jwt.sign(
      {
        id: String(admin._id),
        email: admin.email,
      },
      env.jwtSecret,
    );
  };

  beforeAll(async () => {
    await connectMongoMemory();
  });

  afterAll(async () => {
    await disconnectMongoMemory();
    if (fs.existsSync(uploadDir)) {
      for (const file of fs.readdirSync(uploadDir)) {
        if (file.startsWith("test-") || file.includes("image")) {
          fs.rmSync(path.join(uploadDir, file), { force: true });
        }
      }
    }
  });

  beforeEach(async () => {
    await clearMongoMemory();
    await createAdminUserAndToken();
  });

  it("requires authentication", async () => {
    await request(app).get("/api/admin/collections").expect(401);
  });

  it("supports secure CRUD and writes audit logs", async () => {
    await request(app)
      .put("/api/admin/collections/config/AdminItems")
      .set(authHeader())
      .send({
        fields: [
          {
            name: "name",
            type: "string",
            required: true,
            editable: true,
            visible: true,
          },
          {
            name: "price",
            type: "number",
            required: true,
            editable: true,
            visible: true,
            validators: { min: 1 },
          },
          { name: "sku", type: "string", editable: false, visible: true },
        ],
        listDefaults: { pageSize: 25, defaultSort: { _id: -1 } },
      })
      .expect(200);

    await request(app)
      .post("/api/admin/collections/AdminItems")
      .set(authHeader())
      .send({ name: "Pizza" })
      .expect(400);

    const createdResponse = await request(app)
      .post("/api/admin/collections/AdminItems")
      .set(authHeader())
      .send({ name: "Pizza", price: 10, sku: "PZ-001" })
      .expect(201);

    const id = String(createdResponse.body.data._id);

    await request(app)
      .put(`/api/admin/collections/AdminItems/${id}`)
      .set(authHeader())
      .send({ sku: "PZ-002" })
      .expect(400);

    await request(app)
      .put(`/api/admin/collections/AdminItems/${id}`)
      .set(authHeader())
      .send({ price: 12 })
      .expect(200);

    const listResponse = await request(app)
      .get("/api/admin/collections/AdminItems?q=piz&limit=10")
      .set(authHeader())
      .expect(200);

    expect(listResponse.body.data.docs).toHaveLength(1);
    expect(listResponse.body.data.docs[0].price).toBe(12);

    await request(app)
      .delete(`/api/admin/collections/AdminItems/${id}`)
      .set(authHeader())
      .expect(200);

    const auditResponse = await request(app)
      .get("/api/admin/audit?collection=AdminItems&limit=20")
      .set(authHeader())
      .expect(200);

    const actions = auditResponse.body.data.map(
      (entry: { action: string }) => entry.action,
    );
    expect(actions).toContain("create");
    expect(actions).toContain("update");
    expect(actions).toContain("delete");
  });

  it("supports import, export, bulk update and file upload", async () => {
    await request(app)
      .put("/api/admin/collections/config/ImportItems")
      .set(authHeader())
      .send({
        fields: [
          {
            name: "name",
            type: "string",
            required: true,
            editable: true,
            visible: true,
          },
          {
            name: "price",
            type: "number",
            required: true,
            editable: true,
            visible: true,
          },
          { name: "imageUrl", type: "file", editable: true, visible: true },
        ],
      })
      .expect(200);

    const importResponse = await request(app)
      .post("/api/admin/collections/ImportItems/import")
      .set(authHeader())
      .field("mapping", "{}")
      .field("onConflict", "skip")
      .attach("file", Buffer.from("name,price\nBurger,8\n"), {
        filename: "items.csv",
        contentType: "text/csv",
      })
      .expect(200);

    expect(importResponse.body.data.inserted).toBe(1);

    const listResponse = await request(app)
      .get("/api/admin/collections/ImportItems")
      .set(authHeader())
      .expect(200);

    const itemId = String(listResponse.body.data.docs[0]._id);

    await request(app)
      .post("/api/admin/collections/ImportItems/bulk")
      .set(authHeader())
      .send({
        action: "update",
        ids: [itemId],
        payload: { price: 11 },
      })
      .expect(200);

    const uploadResponse = await request(app)
      .post(`/api/admin/collections/ImportItems/${itemId}/assets`)
      .set(authHeader())
      .field("field", "imageUrl")
      .attach("file", Buffer.from("fake-image"), {
        filename: "test-image.png",
        contentType: "image/png",
      })
      .expect(200);

    expect(uploadResponse.body.data.path).toContain("/uploads/admin/");

    const exportResponse = await request(app)
      .get(
        "/api/admin/collections/ImportItems/export?format=csv&fields=name,price",
      )
      .set(authHeader())
      .expect(200);

    expect(exportResponse.text).toContain("name,price");
    expect(exportResponse.text).toContain("Burger,11");
  });
});
