import { Request, Response } from "express";
import mongoose from "mongoose";
import AdminConfig from "../models/AdminConfig";

const LIST_LIMIT = 100;

export const listCollections = async (_req: Request, res: Response) => {
  try {
    const cols = await mongoose.connection.db.listCollections().toArray();
    const names = cols.map((c) => c.name).filter(Boolean);
    const result = await Promise.all(
      names.map(async (name) => {
        let count = 0;
        try {
          count = await mongoose.connection.db
            .collection(name)
            .countDocuments();
        } catch {
          count = 0;
        }
        return { name, count };
      }),
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("listCollections error:", error);
    res.status(500).json({ error: "Error al listar colecciones" });
  }
};

export const listRecords = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    let limit = parseInt((req.query.limit as string) || "20", 10);
    if (Number.isNaN(limit) || limit <= 0) limit = 20;
    limit = Math.min(limit, LIST_LIMIT);
    const skip = (page - 1) * limit;

    const col = mongoose.connection.db.collection(collection);
    const docs = await col.find({}).skip(skip).limit(limit).toArray();
    const total = await col.countDocuments();

    res.json({ success: true, data: { docs, total, page, limit } });
  } catch (error) {
    console.error("listRecords error:", error);
    res.status(500).json({ error: "Error al listar registros" });
  }
};

export const getRecord = async (req: Request, res: Response) => {
  try {
    const { collection, id } = req.params;
    const col = mongoose.connection.db.collection(collection);
    const doc = await col.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!doc) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    console.error("getRecord error:", error);
    res.status(500).json({ error: "Error al obtener registro" });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const payload = req.body;
    const col = mongoose.connection.db.collection(collection);
    const result = await col.insertOne(payload);
    const inserted = await col.findOne({ _id: result.insertedId });
    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    console.error("createRecord error:", error);
    res.status(500).json({ error: "Error al crear registro" });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { collection, id } = req.params;
    const payload = req.body;
    const col = mongoose.connection.db.collection(collection);
    const oid = new mongoose.Types.ObjectId(id);
    await col.updateOne({ _id: oid }, { $set: payload });
    const updated = await col.findOne({ _id: oid });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("updateRecord error:", error);
    res.status(500).json({ error: "Error al actualizar registro" });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { collection, id } = req.params;
    const col = mongoose.connection.db.collection(collection);
    const oid = new mongoose.Types.ObjectId(id);
    const existing = await col.findOne({ _id: oid });
    if (!existing) {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }
    await col.deleteOne({ _id: oid });
    res.json({ success: true, message: "Registro eliminado" });
  } catch (error) {
    console.error("deleteRecord error:", error);
    res.status(500).json({ error: "Error al eliminar registro" });
  }
};

export const getConfig = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    let cfg = await AdminConfig.findOne({ collection });
    if (!cfg) {
      // try to build a default config from a sample doc
      const sample = await mongoose.connection.db
        .collection(collection)
        .findOne({});
      const fields = sample
        ? Object.keys(sample).map((name, i) => ({
            name,
            label: name,
            visible: true,
            editable: name !== "_id",
            type: typeof sample[name],
            order: i,
          }))
        : [];
      cfg = new AdminConfig({ collection, fields });
      await cfg.save();
    }
    res.json({ success: true, data: cfg });
  } catch (error) {
    console.error("getConfig error:", error);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const payload = req.body;
    const cfg = await AdminConfig.findOneAndUpdate(
      { collection },
      { $set: payload },
      { new: true, upsert: true },
    );
    res.json({ success: true, data: cfg });
  } catch (error) {
    console.error("updateConfig error:", error);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
};

export default {
  listCollections,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getConfig,
  updateConfig,
};
