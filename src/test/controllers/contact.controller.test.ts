import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactController } from "../../controllers/contact.controller";
import { ContactService } from "../../services/contact.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContactController", () => {
  it("create returns 201 and created contact", async () => {
    const contact = { _id: "c1", message: "hola" };
    vi.spyOn(ContactService, "create").mockResolvedValue(contact as any);

    const req = { body: { message: "hola" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await ContactController.create(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: contact }));
  });

  it("updateStatus returns 200 and updated contact", async () => {
    const contact = { _id: "c1", status: "read" };
    vi.spyOn(ContactService, "updateStatus").mockResolvedValue(contact as any);

    const req = { params: { id: "c1" }, body: { status: "read" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await ContactController.updateStatus(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: contact }));
  });

  it("delete returns 200 with message", async () => {
    vi.spyOn(ContactService, "delete").mockResolvedValue(undefined as any);

    const req = { params: { id: "c1" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await ContactController.delete(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { message: "Mensaje eliminado" } }));
  });
});
