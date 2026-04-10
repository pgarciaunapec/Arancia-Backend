import { Request, Response } from "express";
import mongoose from "mongoose";
import AdminConfig from "../models/AdminConfig";
import { AuditLog } from "../models/AuditLog";
import { AuthRequest } from "../types/index";
import {
  canRole,
  ensureReferenceIntegrity,
  getOrCreateAdminConfig,
  logAuditEntry,
  parseImportFile,
  resolveListQuery,
  runImport,
  sanitizeOutputByConfig,
  sanitizePayloadByConfig,
  toCSV,
  type OnConflictMode,
} from "../services/admin.collections.service";

const getMeta = (req: Request) => ({
  ip: req.ip,
  userAgent: req.get("user-agent") || undefined,
  requestId: req.get("x-request-id") || undefined,
});

const resolveCollection = async (collection: string) => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not available");
  }
  return db.collection(collection);
};

const getDb = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not available");
  }
  return db;
};

const parseIdOrFallback = (id: string): mongoose.Types.ObjectId | string => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

const byId = (id: string) => ({ _id: parseIdOrFallback(id) as any });

const byIds = (ids: string[]) => ({
  _id: { $in: ids.map((value) => parseIdOrFallback(value)) as any[] },
});

const deny = (res: Response, message: string) => {
  res.status(403).json({ error: message });
};

export const listCollections = async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const cols = await db.listCollections().toArray();
    const names = cols
      .map((c) => c.name)
      .filter((name): name is string => Boolean(name))
      .filter((name) => !name.startsWith("system."));

    const result = await Promise.all(
      names.map(async (name) => {
        const count = await db.collection(name).countDocuments();
        return { name, count };
      }),
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("listCollections error:", error);
    res.status(500).json({ error: "Error al listar colecciones" });
  }
};

export const listRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    const config = await getOrCreateAdminConfig(collection);
    if (!canRole(config, req.user?.role, "read")) {
      deny(res, "No tienes permisos de lectura para esta colección");
      return;
    }

    const { page, limit, skip, sort, filter } = resolveListQuery(
      req.query as Record<string, unknown>,
      config,
    );

    const col = await resolveCollection(collection);
    const docs = await col
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await col.countDocuments(filter);

    res.json({
      success: true,
      data: {
        docs: docs.map((doc) =>
          sanitizeOutputByConfig(doc as Record<string, unknown>, config),
        ),
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("listRecords error:", error);
    res.status(500).json({ error: "Error al listar registros" });
  }
};

export const getRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    const config = await getOrCreateAdminConfig(collection);
    if (!canRole(config, req.user?.role, "read")) {
      deny(res, "No tienes permisos de lectura para esta colección");
      return;
    }

    const col = await resolveCollection(collection);
    const doc = await col.findOne(byId(id));

    if (!doc) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }

    res.json({
      success: true,
      data: sanitizeOutputByConfig(doc as Record<string, unknown>, config),
    });
  } catch (error) {
    console.error("getRecord error:", error);
    res.status(500).json({ error: "Error al obtener registro" });
  }
};

export const createRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    const payload = (req.body || {}) as Record<string, unknown>;
    const config = await getOrCreateAdminConfig(collection);

    if (!canRole(config, req.user?.role, "write")) {
      deny(res, "No tienes permisos de escritura para esta colección");
      return;
    }

    const { sanitized, errors } = sanitizePayloadByConfig(
      payload,
      config,
      "create",
    );
    if (errors.length > 0) {
      res.status(400).json({ error: "Error de validación", details: errors });
      return;
    }

    const col = await resolveCollection(collection);
    const result = await col.insertOne(sanitized);
    const inserted = await col.findOne({ _id: result.insertedId });

    await logAuditEntry({
      userId: req.user?.id,
      userEmail: req.user?.email || "unknown",
      action: "create",
      collection,
      docId: String(result.insertedId),
      diff: { after: inserted || sanitized },
      meta: getMeta(req),
    });

    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    console.error("createRecord error:", error);
    res.status(500).json({ error: "Error al crear registro" });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    const payload = (req.body || {}) as Record<string, unknown>;
    const config = await getOrCreateAdminConfig(collection);

    if (!canRole(config, req.user?.role, "write")) {
      deny(res, "No tienes permisos de escritura para esta colección");
      return;
    }

    const col = await resolveCollection(collection);
    const before = await col.findOne(byId(id));

    if (!before) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }

    if (
      payload.__v !== undefined &&
      before.__v !== undefined &&
      payload.__v !== before.__v
    ) {
      res.status(409).json({ error: "Conflicto de versión" });
      return;
    }

    if (
      payload.updatedAt !== undefined &&
      before.updatedAt !== undefined &&
      new Date(String(payload.updatedAt)).getTime() !==
        new Date(String(before.updatedAt)).getTime()
    ) {
      res
        .status(409)
        .json({ error: "El registro fue actualizado por otro usuario" });
      return;
    }

    const { sanitized, errors } = sanitizePayloadByConfig(
      payload,
      config,
      "update",
    );
    if (errors.length > 0) {
      res.status(400).json({ error: "Error de validación", details: errors });
      return;
    }

    await col.updateOne(byId(id), { $set: sanitized });
    const updated = await col.findOne(byId(id));

    await logAuditEntry({
      userId: req.user?.id,
      userEmail: req.user?.email || "unknown",
      action: "update",
      collection,
      docId: String(id),
      diff: { before, after: updated || sanitized },
      meta: getMeta(req),
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("updateRecord error:", error);
    res.status(500).json({ error: "Error al actualizar registro" });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    const cascade = String(req.query.cascade || "false") === "true";
    const config = await getOrCreateAdminConfig(collection);

    if (!canRole(config, req.user?.role, "delete")) {
      deny(res, "No tienes permisos de borrado para esta colección");
      return;
    }

    const col = await resolveCollection(collection);
    const existing = await col.findOne(byId(id));
    if (!existing) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }

    const conflicts = await ensureReferenceIntegrity({
      collection,
      id,
      cascade,
    });
    if (conflicts.length > 0) {
      res.status(400).json({
        error: "No se puede eliminar: existen referencias activas",
        details: conflicts,
      });
      return;
    }

    await col.deleteOne(byId(id));

    await logAuditEntry({
      userId: req.user?.id,
      userEmail: req.user?.email || "unknown",
      action: "delete",
      collection,
      docId: id,
      diff: { before: existing },
      meta: getMeta(req),
    });

    res.json({ success: true, message: "Registro eliminado" });
  } catch (error) {
    console.error("deleteRecord error:", error);
    res.status(500).json({ error: "Error al eliminar registro" });
  }
};

export const bulkAction = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    const action = String(req.body?.action || "");
    const ids = Array.isArray(req.body?.ids) ? (req.body.ids as string[]) : [];
    const payload = (req.body?.payload || {}) as Record<string, unknown>;

    if (ids.length === 0) {
      res.status(400).json({ error: "Debes enviar al menos un ID" });
      return;
    }

    const config = await getOrCreateAdminConfig(collection);
    const col = await resolveCollection(collection);

    if (action === "delete") {
      if (!canRole(config, req.user?.role, "delete")) {
        deny(res, "No tienes permisos de borrado para esta colección");
        return;
      }

      const docsBefore = await col.find(byIds(ids)).toArray();

      for (const id of ids) {
        const conflicts = await ensureReferenceIntegrity({
          collection,
          id,
          cascade: false,
        });
        if (conflicts.length > 0) {
          res.status(400).json({
            error: `No se puede eliminar ${id}: existen referencias activas`,
            details: conflicts,
          });
          return;
        }
      }

      const result = await col.deleteMany(byIds(ids));
      await logAuditEntry({
        userId: req.user?.id,
        userEmail: req.user?.email || "unknown",
        action: "bulk-delete",
        collection,
        diff: { before: docsBefore },
        meta: getMeta(req),
      });

      res.json({ success: true, data: { affected: result.deletedCount || 0 } });
      return;
    }

    if (action === "update") {
      if (!canRole(config, req.user?.role, "write")) {
        deny(res, "No tienes permisos de escritura para esta colección");
        return;
      }

      const { sanitized, errors } = sanitizePayloadByConfig(
        payload,
        config,
        "update",
      );
      if (errors.length > 0) {
        res.status(400).json({ error: "Error de validación", details: errors });
        return;
      }

      const before = await col.find(byIds(ids)).toArray();
      const result = await col.updateMany(byIds(ids), { $set: sanitized });
      const after = await col.find(byIds(ids)).toArray();

      await logAuditEntry({
        userId: req.user?.id,
        userEmail: req.user?.email || "unknown",
        action: "bulk-update",
        collection,
        diff: { before, after },
        meta: getMeta(req),
      });

      res.json({
        success: true,
        data: { affected: result.modifiedCount || 0 },
      });
      return;
    }

    res
      .status(400)
      .json({ error: "Acción no soportada. Usa 'update' o 'delete'" });
  } catch (error) {
    console.error("bulkAction error:", error);
    res.status(500).json({ error: "Error al ejecutar acción masiva" });
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const cfg = await getOrCreateAdminConfig(collection);
    res.json({ success: true, data: cfg });
  } catch (error) {
    console.error("getConfig error:", error);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const payload = (req.body || {}) as Record<string, unknown>;

    const cfg = await AdminConfig.findOneAndUpdate(
      { collection },
      {
        $set: {
          ...payload,
          collection,
        },
      },
      { new: true, upsert: true },
    );
    res.json({ success: true, data: cfg });
  } catch (error) {
    console.error("updateConfig error:", error);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
};

export const importRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    const file = req.file;

    if (!file) {
      res
        .status(400)
        .json({ error: "Debes adjuntar un archivo para importar" });
      return;
    }

    const config = await getOrCreateAdminConfig(collection);
    if (!canRole(config, req.user?.role, "write")) {
      deny(res, "No tienes permisos de escritura para esta colección");
      return;
    }

    const mappingRaw = String(req.body?.mapping || "{}");
    let mapping: Record<string, string>;
    try {
      mapping = JSON.parse(mappingRaw) as Record<string, string>;
    } catch {
      res.status(400).json({ error: "El mapping debe ser un JSON válido" });
      return;
    }
    const onConflictRaw = String(req.body?.onConflict || "skip");
    const onConflict = (
      ["skip", "replace", "merge"].includes(onConflictRaw)
        ? onConflictRaw
        : "skip"
    ) as OnConflictMode;
    const rows = parseImportFile(
      file.originalname,
      file.buffer.toString("utf-8"),
    );

    const summary = await runImport({
      collection,
      rows,
      config,
      onConflict,
      mapping,
    });

    await logAuditEntry({
      userId: req.user?.id,
      userEmail: req.user?.email || "unknown",
      action: "import",
      collection,
      diff: { after: summary },
      meta: getMeta(req),
    });

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("importRecords error:", error);
    res.status(500).json({ error: "Error al importar registros" });
  }
};

export const exportRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { collection } = req.params;
    const format = String(req.query.format || "csv").toLowerCase();
    const fields = String(req.query.fields || "")
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean);

    const config = await getOrCreateAdminConfig(collection);
    if (!canRole(config, req.user?.role, "read")) {
      deny(res, "No tienes permisos de lectura para esta colección");
      return;
    }

    const { filter, sort } = resolveListQuery(
      req.query as Record<string, unknown>,
      config,
    );
    const col = await resolveCollection(collection);
    const records = await col.find(filter).sort(sort).toArray();

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=\"${collection}.json\"`,
      );
      res.send(JSON.stringify(records, null, 2));
      return;
    }

    const csv = toCSV(records as Record<string, unknown>[], fields);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${collection}.csv\"`,
    );
    res.send(csv);
  } catch (error) {
    console.error("exportRecords error:", error);
    res.status(500).json({ error: "Error al exportar registros" });
  }
};

export const uploadAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { collection, id } = req.params;
    const fieldName = String(req.body?.field || "fileRef");
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No se encontró archivo en la solicitud" });
      return;
    }

    const config = await getOrCreateAdminConfig(collection);
    if (!canRole(config, req.user?.role, "write")) {
      deny(res, "No tienes permisos de escritura para esta colección");
      return;
    }

    const col = await resolveCollection(collection);
    const before = await col.findOne(byId(id));
    if (!before) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }

    const publicPath = `/uploads/admin/${file.filename}`;
    await col.updateOne(byId(id), { $set: { [fieldName]: publicPath } });
    const after = await col.findOne(byId(id));

    await logAuditEntry({
      userId: req.user?.id,
      userEmail: req.user?.email || "unknown",
      action: "update",
      collection,
      docId: id,
      diff: { before, after },
      meta: getMeta(req),
    });

    res.json({
      success: true,
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: publicPath,
      },
    });
  } catch (error) {
    console.error("uploadAsset error:", error);
    res.status(500).json({ error: "Error al subir archivo" });
  }
};

export const listAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const collection = String(req.query.collection || "").trim();
    const docId = String(req.query.docId || "").trim();
    const limit = Math.min(
      200,
      parseInt(String(req.query.limit || "50"), 10) || 50,
    );

    const filter: Record<string, unknown> = {};
    if (collection) filter.collection = collection;
    if (docId) filter.docId = docId;

    const rows = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("listAuditLogs error:", error);
    res.status(500).json({ error: "Error al obtener auditoría" });
  }
};

export const validateObjectId = (_req: Request, _res: Response, id: string) => {
  if (!id) {
    throw new Error("ID inválido");
  }
};

export default {
  listCollections,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkAction,
  getConfig,
  updateConfig,
  importRecords,
  exportRecords,
  uploadAsset,
  listAuditLogs,
};
