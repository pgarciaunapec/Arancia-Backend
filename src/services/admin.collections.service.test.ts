import { describe, expect, it } from "vitest";
import {
  applyFieldMapping,
  parseImportFile,
  resolveListQuery,
  sanitizePayloadByConfig,
  toCSV,
} from "./admin.collections.service";

const buildConfig = () =>
  ({
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
      {
        name: "sku",
        type: "string",
        editable: false,
        visible: true,
        validators: { pattern: "^[A-Z0-9-]+$" },
      },
    ],
    listDefaults: { pageSize: 20, defaultSort: { _id: -1 } },
    permissions: {},
  }) as any;

describe("admin.collections.service", () => {
  it("applies mapping from import columns", () => {
    const row = { Nombre: "Pizza", Precio: "12.5" };
    const mapped = applyFieldMapping(row, { Nombre: "name", Precio: "price" });
    expect(mapped).toEqual({ name: "Pizza", price: "12.5" });
  });

  it("parses CSV and JSON imports", () => {
    const csvRows = parseImportFile("items.csv", "name,price\nPizza,10\n");
    expect(csvRows).toEqual([{ name: "Pizza", price: "10" }]);

    const jsonRows = parseImportFile(
      "items.json",
      JSON.stringify([{ name: "Pasta" }]),
    );
    expect(jsonRows).toEqual([{ name: "Pasta" }]);
  });

  it("validates required and non-editable fields", () => {
    const cfg = buildConfig();

    const createResult = sanitizePayloadByConfig(
      { name: "Pizza" },
      cfg,
      "create",
    );
    expect(createResult.errors).toContain("El campo price es requerido");

    const updateResult = sanitizePayloadByConfig(
      { sku: "ABC-1" },
      cfg,
      "update",
    );
    expect(updateResult.errors).toContain("El campo sku no es editable");
  });

  it("casts numeric fields and enforces min validator", () => {
    const cfg = buildConfig();
    const bad = sanitizePayloadByConfig(
      { name: "Pizza", price: "0" },
      cfg,
      "create",
    );
    expect(bad.errors).toContain("El campo price debe ser >= 1");

    const good = sanitizePayloadByConfig(
      { name: "Pizza", price: "20" },
      cfg,
      "create",
    );
    expect(good.errors).toHaveLength(0);
    expect(good.sanitized.price).toBe(20);
  });

  it("builds list query with paging, filters and sort", () => {
    const cfg = buildConfig();
    const query = resolveListQuery(
      {
        page: "2",
        limit: "10",
        sort: "price:asc",
        "filter[name]": "Pizza",
      },
      cfg,
    );

    expect(query.page).toBe(2);
    expect(query.limit).toBe(10);
    expect(query.skip).toBe(10);
    expect(query.sort).toEqual({ price: 1 });
    expect(query.filter).toMatchObject({ name: "Pizza" });
  });

  it("exports records as csv", () => {
    const csv = toCSV(
      [
        { name: "Pizza", price: 10 },
        { name: "Pasta", price: 12 },
      ],
      ["name", "price"],
    );

    expect(csv).toContain("name,price");
    expect(csv).toContain("Pizza,10");
    expect(csv).toContain("Pasta,12");
  });
});
