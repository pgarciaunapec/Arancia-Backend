import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";
import { getImage } from "../../controllers/image.controller";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Image controller", () => {
  it("returns 400 for invalid id", async () => {
    vi.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    const req = { params: { id: "bad-id" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await getImage(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: "ID inválido" });
  });
});
