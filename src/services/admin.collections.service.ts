import mongoose from "mongoose";
import { parse } from "csv-parse/sync";
import AdminConfig, {
  IAdminConfigDocument,
  IFieldConfig,
} from "../models/AdminConfig";
import { AuditLog } from "../models/AuditLog";

type Primitive = string | number | boolean | null;

export interface ImportError {
  line: number;
  reason: string;
  payload: Record<string, unknown>;
}

export interface ImportSummary {
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
}

export type OnConflictMode = "skip" | "replace" | "merge";

const DEFAULT_PAGE_SIZE = 20;
const MAX_LIMIT = 100;

const MENU_FIELD_LABELS: Record<string, string> = {
  description: "Descripción del menú",
  ingredients: "Ingredientes",
};

const isMenuCollection = (collection: string): boolean =>
  collection.toLowerCase().includes("menu");

const resolveFieldLabel = (collection: string, fieldName: string): string => {
  if (isMenuCollection(collection) && MENU_FIELD_LABELS[fieldName]) {
    return MENU_FIELD_LABELS[fieldName];
  }

  return fieldName;
};

const getDb = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not available");
  }
  return db;
};

const csvEscape = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const parseMaybeObjectId = (id: string): mongoose.Types.ObjectId | string => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  return undefined;
};

const castValueByType = (value: unknown, field?: IFieldConfig): unknown => {
  if (!field || value === undefined || value === null) return value;

  switch (field.type) {
    case "number": {
      const n = toNumber(value);
      return n === undefined ? value : n;
    }
    case "boolean": {
      const b = parseBoolean(value);
      return b === undefined ? value : b;
    }
    case "date":
    case "datetime": {
      if (value instanceof Date) return value;
      const parsed = new Date(String(value));
      return Number.isNaN(parsed.getTime()) ? value : parsed;
    }
    case "array": {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        try {
          const maybeArray = JSON.parse(value);
          if (Array.isArray(maybeArray)) return maybeArray;
        } catch {
          return value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean);
        }
      }
      return value;
    }
    case "object": {
      if (typeof value === "object") return value;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }
    default:
      return value;
  }
};

const buildRegex = (term: string): RegExp => {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
};

export const resolveListQuery = (
  query: Record<string, unknown>,
  cfg: IAdminConfigDocument,
) => {
  const page = Math.max(1, parseInt(String(query.page || "1"), 10) || 1);
  const configuredLimit = cfg.listDefaults?.pageSize || DEFAULT_PAGE_SIZE;
  const rawLimit = parseInt(String(query.limit || configuredLimit), 10);
  const limit = Math.min(
    MAX_LIMIT,
    Number.isNaN(rawLimit) ? configuredLimit : rawLimit,
  );

  const sort: Record<string, 1 | -1> = {};
  const sortParam = String(query.sort || "").trim();
  if (sortParam) {
    const [fieldName, direction] = sortParam.split(":");
    if (fieldName) {
      sort[fieldName] = direction === "asc" ? 1 : -1;
    }
  } else if (cfg.listDefaults?.defaultSort) {
    Object.entries(cfg.listDefaults.defaultSort).forEach(([field, value]) => {
      sort[field] = value === 1 ? 1 : -1;
    });
  } else {
    sort._id = -1;
  }

  const filter: Record<string, unknown> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (!key.startsWith("filter[")) return;
    if (typeof value !== "string" || !value.trim()) return;
    const fieldName = key.replace("filter[", "").replace("]", "");
    filter[fieldName] = value;
  });

  const q = String(query.q || "").trim();
  if (q) {
    const regex = buildRegex(q);
    const searchableFields = cfg.fields
      .filter((field) =>
        ["string", "enum", "reference"].includes(field.type || "string"),
      )
      .map((field) => field.name);

    if (searchableFields.length > 0) {
      filter.$or = searchableFields.map((fieldName) => ({
        [fieldName]: regex,
      }));
    }
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
    filter,
  };
};

export const canRole = (
  cfg: IAdminConfigDocument,
  role: string | undefined,
  action: "read" | "write" | "delete",
): boolean => {
  if (!role) return false;
  const permission = cfg.permissions?.[role];
  if (!permission) return true;
  const explicit = permission[action];
  return explicit !== false;
};

export const sanitizeOutputByConfig = (
  doc: Record<string, unknown>,
  cfg: IAdminConfigDocument,
): Record<string, unknown> => {
  const visibility = new Map(
    cfg.fields.map((field) => [field.name, field.visible !== false]),
  );

  return Object.entries(doc).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      const isVisible = visibility.has(key) ? visibility.get(key) : true;
      if (isVisible) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
};

const ensureFieldRules = (
  field: IFieldConfig,
  value: unknown,
  errors: string[],
): void => {
  if (value === undefined || value === null || value === "") {
    if (field.required) {
      errors.push(`El campo ${field.name} es requerido`);
    }
    return;
  }

  const casted = castValueByType(value, field);

  if (
    field.type === "enum" &&
    field.enumOptions &&
    !field.enumOptions.includes(String(casted))
  ) {
    errors.push(
      `El campo ${field.name} debe ser uno de: ${field.enumOptions.join(", ")}`,
    );
  }

  if (field.validators?.pattern && typeof casted === "string") {
    const regex = new RegExp(field.validators.pattern);
    if (!regex.test(casted)) {
      errors.push(`El campo ${field.name} no cumple el patrón esperado`);
    }
  }

  if (typeof casted === "number") {
    if (field.validators?.min !== undefined && casted < field.validators.min) {
      errors.push(`El campo ${field.name} debe ser >= ${field.validators.min}`);
    }
    if (field.validators?.max !== undefined && casted > field.validators.max) {
      errors.push(`El campo ${field.name} debe ser <= ${field.validators.max}`);
    }
  }
};

export const sanitizePayloadByConfig = (
  payload: Record<string, unknown>,
  cfg: IAdminConfigDocument,
  mode: "create" | "update",
) => {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};
  const fieldMap = new Map(cfg.fields.map((field) => [field.name, field]));

  if (cfg.fields.length === 0) {
    return { sanitized: payload, errors };
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
      return;
    }

    const field = fieldMap.get(key);
    if (!field) {
      return;
    }

    if (mode === "update" && field.editable === false) {
      errors.push(`El campo ${key} no es editable`);
      return;
    }

    const casted = castValueByType(value, field);
    ensureFieldRules(field, casted, errors);

    sanitized[key] = casted;
  });

  if (mode === "create") {
    cfg.fields.forEach((field) => {
      if (!field.required) return;
      if (
        payload[field.name] !== undefined &&
        payload[field.name] !== null &&
        payload[field.name] !== ""
      ) {
        return;
      }
      errors.push(`El campo ${field.name} es requerido`);
    });
  }

  return { sanitized, errors };
};

export const getOrCreateAdminConfig = async (
  collection: string,
): Promise<IAdminConfigDocument> => {
  const sample = await getDb().collection(collection).findOne({});

  let config = await AdminConfig.findOne({ collection });
  if (config) {
    const existingConfig = config;

    if (sample) {
      let changed = false;
      const existingFieldMap = new Map(
        existingConfig.fields.map((field) => [field.name, field]),
      );

      Object.keys(sample).forEach((name) => {
        const existingField = existingFieldMap.get(name);

        if (!existingField) {
          existingConfig.fields.push({
            name,
            label: resolveFieldLabel(collection, name),
            visible: true,
            editable: name !== "_id",
            type: inferFieldType((sample as Record<string, unknown>)[name]),
            order: existingConfig.fields.length,
          });
          changed = true;
          return;
        }

        const suggestedLabel = resolveFieldLabel(collection, name);
        if (
          existingField.label === undefined ||
          existingField.label === name ||
          existingField.label === ""
        ) {
          if (existingField.label !== suggestedLabel) {
            existingField.label = suggestedLabel;
            changed = true;
          }
        }
      });

      if (changed) {
        await existingConfig.save();
      }
    }

    return existingConfig;
  }

  const fields = sample
    ? Object.keys(sample).map((name, index) => ({
        name,
        label: resolveFieldLabel(collection, name),
        visible: true,
        editable: name !== "_id",
        type: inferFieldType(sample[name]),
        order: index,
      }))
    : [];

  // Use upsert to handle concurrent calls and prevent duplicate key errors
  config = await AdminConfig.findOneAndUpdate(
    { collection },
    {
      collection,
      fields,
      listDefaults: { pageSize: 20, defaultSort: { _id: -1 } },
    },
    { upsert: true, new: true },
  );
  if (!config)
    throw new Error(
      `Failed to create AdminConfig for collection: ${collection}`,
    );
  return config;
};

export const inferFieldType = (value: unknown): string => {
  if (value === null || value === undefined) return "string";
  if (value instanceof Date) return "datetime";
  if (Array.isArray(value)) return "array";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "object") return "object";
  return "string";
};

export const logAuditEntry = async (payload: {
  userId?: string;
  userEmail: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "import"
    | "bulk-update"
    | "bulk-delete";
  collection: string;
  docId?: string;
  diff?: { before?: unknown; after?: unknown };
  meta?: { ip?: string; userAgent?: string; requestId?: string };
}) => {
  await AuditLog.create({
    userId: payload.userId ? parseMaybeObjectId(payload.userId) : undefined,
    userEmail: payload.userEmail,
    action: payload.action,
    collection: payload.collection,
    docId: payload.docId,
    diff: payload.diff,
    meta: payload.meta,
    timestamp: new Date(),
  });
};

export const parseImportFile = (
  fileName: string,
  input: string,
): Record<string, unknown>[] => {
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.endsWith(".json")) {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      throw new Error("El archivo JSON debe contener un arreglo de objetos");
    }
    return parsed as Record<string, unknown>[];
  }

  const rows = parse(input, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, unknown>[];

  return rows;
};

export const applyFieldMapping = (
  row: Record<string, unknown>,
  mapping: Record<string, string>,
): Record<string, unknown> => {
  if (!mapping || Object.keys(mapping).length === 0) {
    return row;
  }

  return Object.entries(row).reduce<Record<string, unknown>>(
    (acc, [source, value]) => {
      const target = mapping[source] || source;
      acc[target] = value;
      return acc;
    },
    {},
  );
};

export const runImport = async (params: {
  collection: string;
  rows: Record<string, unknown>[];
  config: IAdminConfigDocument;
  onConflict: OnConflictMode;
  mapping: Record<string, string>;
}) => {
  const summary: ImportSummary = {
    processed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const col = getDb().collection(params.collection);

  for (let index = 0; index < params.rows.length; index += 1) {
    summary.processed += 1;
    const sourceRow = params.rows[index];
    const mapped = applyFieldMapping(sourceRow, params.mapping);
    const idCandidate = mapped._id ? String(mapped._id) : undefined;

    const { sanitized, errors } = sanitizePayloadByConfig(
      mapped,
      params.config,
      idCandidate ? "update" : "create",
    );
    if (errors.length > 0) {
      summary.errors.push({
        line: index + 1,
        reason: errors.join("; "),
        payload: mapped,
      });
      continue;
    }

    if (!idCandidate) {
      await col.insertOne(sanitized);
      summary.inserted += 1;
      continue;
    }

    const _id = parseMaybeObjectId(idCandidate);
    const existing = await col.findOne({ _id: _id as any });

    if (!existing) {
      await col.insertOne({ ...sanitized, _id: _id as any });
      summary.inserted += 1;
      continue;
    }

    if (params.onConflict === "skip") {
      summary.skipped += 1;
      continue;
    }

    const updatePayload =
      params.onConflict === "replace"
        ? sanitized
        : {
            ...existing,
            ...sanitized,
          };

    await col.replaceOne(
      { _id: _id as any },
      updatePayload as Record<
        string,
        Primitive | Record<string, unknown> | unknown[]
      >,
    );
    summary.updated += 1;
  }

  return summary;
};

export const toCSV = (
  records: Record<string, unknown>[],
  explicitFields?: string[],
) => {
  if (records.length === 0) {
    if (!explicitFields || explicitFields.length === 0) return "";
    return `${explicitFields.join(",")}\n`;
  }

  const headers =
    explicitFields && explicitFields.length > 0
      ? explicitFields
      : Array.from(
          records.reduce<Set<string>>((acc, record) => {
            Object.keys(record).forEach((key) => acc.add(key));
            return acc;
          }, new Set<string>()),
        );

  const lines = [headers.join(",")];
  records.forEach((record) => {
    const row = headers.map((header) => csvEscape(record[header]));
    lines.push(row.join(","));
  });

  return `${lines.join("\n")}\n`;
};

export const ensureReferenceIntegrity = async (params: {
  collection: string;
  id: string;
  cascade: boolean;
}) => {
  const configs = await AdminConfig.find({
    "fields.reference.collection": params.collection,
  });

  const conflicts: Array<{ collection: string; field: string; count: number }> =
    [];

  for (const cfg of configs) {
    const refFields = cfg.fields.filter(
      (field) => field.reference?.collection === params.collection,
    );

    for (const field of refFields) {
      const refCollection = getDb().collection(cfg.collection);
      const objectIdCandidate = parseMaybeObjectId(params.id);
      const count = await refCollection.countDocuments({
        $or: [{ [field.name]: params.id }, { [field.name]: objectIdCandidate }],
      });

      if (!count) continue;

      if (params.cascade) {
        await refCollection.deleteMany({
          $or: [
            { [field.name]: params.id },
            { [field.name]: objectIdCandidate },
          ],
        });
      } else {
        conflicts.push({
          collection: cfg.collection,
          field: field.name,
          count,
        });
      }
    }
  }

  return conflicts;
};

export const buildReferenceSearchFilter = (
  displayField: string,
  q?: string,
) => {
  if (!q || !q.trim()) {
    return {};
  }

  return {
    [displayField]: buildRegex(q.trim()),
  };
};

export const normalizeObjectId = (value: string): mongoose.Types.ObjectId => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error("ID inválido");
  }
  return new mongoose.Types.ObjectId(value);
};
