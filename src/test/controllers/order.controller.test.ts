import { afterEach, describe, expect, it, vi } from "vitest";
import { OrderController } from "../../controllers/order.controller";
import { OrderService } from "../../services/order.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OrderController", () => {
  it("create returns 201 when user present", async () => {
    const order = { _id: "o1" };
    vi.spyOn(OrderService, "create").mockResolvedValue(order as any);

    const req = { user: { id: "u1" }, body: { items: [] } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await OrderController.create(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: order }));
  });

  it("getById returns order", async () => {
    const order = { _id: "o1" };
    vi.spyOn(OrderService, "getById").mockResolvedValue(order as any);

    const req = { params: { id: "o1" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await OrderController.getById(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true, data: order });
  });

  it("updateStatus returns updated order", async () => {
    const order = { _id: "o1", status: "ready" };
    vi.spyOn(OrderService, "updateStatus").mockResolvedValue(order as any);

    const req = { params: { id: "o1" }, body: { status: "ready" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await OrderController.updateStatus(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: order }));
  });
});
