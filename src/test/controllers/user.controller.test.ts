import { afterEach, describe, expect, it, vi } from "vitest";
import { UserController } from "../../controllers/user.controller";
import { UserService } from "../../services/user.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("UserController", () => {
  it("getById returns user", async () => {
    const user = { _id: "u1", name: "Ana" };
    vi.spyOn(UserService, "getById").mockResolvedValue(user as any);

    const req = { params: { id: "u1" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await UserController.getById(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true, data: user });
  });

  it("getAll returns paginated users", async () => {
    const result = { data: [{ _id: "u1" }], total: 1 };
    vi.spyOn(UserService, "getAll").mockResolvedValue(result as any);

    const req = { query: {} } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await UserController.getAll(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: expect.any(Object) }),
    );
  });

  it("updateRole returns updated user", async () => {
    const user = { _id: "u1", role: "staff" };
    vi.spyOn(UserService, "updateRole").mockResolvedValue(user as any);

    const req = { params: { id: "u1" }, body: { role: "staff" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await UserController.updateRole(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: user }));
  });
});
