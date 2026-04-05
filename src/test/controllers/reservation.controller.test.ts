import { afterEach, describe, expect, it, vi } from "vitest";
import { ReservationController } from "../../controllers/reservation.controller";
import { ReservationService } from "../../services/reservation.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ReservationController", () => {
  it("create returns 201", async () => {
    const reservation = { _id: "r1" };
    vi.spyOn(ReservationService, "create").mockResolvedValue(reservation as any);

    const req = { body: { date: "2026-05-01" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await ReservationController.create(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: reservation }));
  });

  it("getByDate returns count and data", async () => {
    const reservations = [{ _id: "r1" }];
    vi.spyOn(ReservationService, "getByDate").mockResolvedValue(reservations as any);

    const req = { params: { date: "2026-05-01" } } as any;
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as any;

    await ReservationController.getByDate(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: { count: reservations.length, data: reservations },
      }),
    );
  });
});
