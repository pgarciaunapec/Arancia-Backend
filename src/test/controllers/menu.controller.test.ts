import { afterEach, describe, expect, it, vi } from "vitest";
import { MenuItemController } from "../../controllers/menu.controller";
import { MenuItemService } from "../../services/menu.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MenuItemController", () => {
  it("getAll returns items with 200", async () => {
    const items = [{ _id: "1", name: "Taco" }];
    vi.spyOn(MenuItemService, "getAll").mockResolvedValue(items as any);

    const req = { query: {} } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await MenuItemController.getAll(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true, data: items });
  });

  it("create returns 201 and created item", async () => {
    const item = { _id: "2", name: "Burrito" };
    vi.spyOn(MenuItemService, "create").mockResolvedValue(item as any);

    const req = { body: { name: "Burrito" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await MenuItemController.create(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: item }),
    );
  });

  it("update returns 200 and updated item", async () => {
    const item = { _id: "2", name: "Burrito" };
    vi.spyOn(MenuItemService, "update").mockResolvedValue(item as any);

    const req = { params: { id: "2" }, body: { name: "Burrito" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await MenuItemController.update(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: item }),
    );
  });
});
