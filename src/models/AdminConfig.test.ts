import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import AdminConfig from "./AdminConfig";
import {
  clearMongoMemory,
  connectMongoMemory,
  disconnectMongoMemory,
} from "../test/mongodb-memory";

describe("AdminConfig model", () => {
  beforeAll(async () => {
    await connectMongoMemory();
    await AdminConfig.syncIndexes();
  });

  afterAll(async () => {
    await disconnectMongoMemory();
  });

  beforeEach(async () => {
    await clearMongoMemory();
  });

  it("applies default values for field visibility/editability", async () => {
    const config = await AdminConfig.create({
      collection: "MenuItem",
      fields: [{ name: "name" }],
    });

    expect(config.fields[0].visible).toBe(true);
    expect(config.fields[0].editable).toBe(true);
    expect(config.listDefaults?.pageSize).toBe(20);
  });

  it("enforces unique collection name", async () => {
    await AdminConfig.create({
      collection: "Order",
      fields: [{ name: "status" }],
    });

    await expect(
      AdminConfig.create({
        collection: "Order",
        fields: [{ name: "total" }],
      }),
    ).rejects.toBeDefined();
  });
});
