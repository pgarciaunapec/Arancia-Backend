import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../../controllers/auth.controller";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AuthController", () => {
  it("register returns 201 with user and token", async () => {
    const user = { _id: "u1", email: "a@b.com" };
    const token = "tok";
    vi.spyOn(AuthService, "register").mockResolvedValue({ user, token } as any);

    const req = { body: { email: "a@b.com", password: "x" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await AuthController.register(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { user, token } }));
  });

  it("login returns 200 with user and token", async () => {
    const user = { _id: "u1", email: "a@b.com" };
    const token = "tok";
    vi.spyOn(AuthService, "login").mockResolvedValue({ user, token } as any);

    const req = { body: { email: "a@b.com", password: "x" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await AuthController.login(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { user, token } }));
  });

  it("getCurrentUser returns 401 when no user", async () => {
    const req = {} as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await AuthController.getCurrentUser(req, res);

    expect(status).toHaveBeenCalledWith(401);
  });

  it("verifyToken returns decoded info on valid token", async () => {
    vi.spyOn(AuthService, "verifyToken").mockReturnValue({ id: "u1", email: "a@b.com" } as any);

    const req = { headers: { authorization: "Bearer tok" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await AuthController.verifyToken(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { valid: true, userId: "u1", email: "a@b.com" } }));
  });
});
