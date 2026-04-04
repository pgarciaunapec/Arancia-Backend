import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app, createApp, startServer } from "./server";
import { env } from "./config/env";
import * as databaseModule from "./config/database";

const originalNodeEnv = env.nodeEnv;

afterEach(() => {
  env.nodeEnv = originalNodeEnv;
  vi.restoreAllMocks();
});

describe("API app", () => {
  it("responde health check", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(typeof response.body.timestamp).toBe("string");
  });

  it("responde 404 para rutas inexistentes", async () => {
    const response = await request(app).get("/api/no-existe");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Ruta no encontrada" });
  });

  it("responde 500 en error no controlado", async () => {
    const response = await request(app).get("/api/test/error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error interno del servidor",
      message: undefined,
    });
  });

  it("incluye mensaje de error en development", async () => {
    env.nodeEnv = "development";
    const developmentApp = createApp();

    const response = await request(developmentApp).get("/api/test/error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Error interno del servidor",
      message: "forced test error",
    });
  });

  it("no expone ruta de error de pruebas en production", async () => {
    env.nodeEnv = "production";
    const productionApp = createApp();

    const response = await request(productionApp).get("/api/test/error");

    expect(response.status).toBe(404);
  });

  it("startServer conecta base de datos y levanta listener", async () => {
    const connectSpy = vi
      .spyOn(databaseModule, "connectDatabase")
      .mockResolvedValue(undefined);
    const listenSpy = vi.spyOn(app, "listen").mockImplementation(((
      _port: unknown,
      callback?: () => void,
    ) => {
      callback?.();
      return {} as never;
    }) as never);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await startServer();

    expect(connectSpy).toHaveBeenCalledTimes(1);
    expect(listenSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
});
