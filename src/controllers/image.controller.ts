import { Request, Response } from "express";
import mongoose from "mongoose";
import { Image } from "../models/Image";

// Servir imágenes desde GridFS y fallback al modelo Image
export const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id);
    const db = mongoose.connection.db;

    // 1. Intentar buscar en GridFS (bucket 'images')
    let bucket = new mongoose.mongo.GridFSBucket(db!, { bucketName: "images" });
    let files = await bucket.find({ _id: objectId }).toArray();

    // 2. Intentar buscar en GridFS (bucket 'fs' por defecto)
    if (!files || files.length === 0) {
      bucket = new mongoose.mongo.GridFSBucket(db!, { bucketName: "fs" });
      files = await bucket.find({ _id: objectId }).toArray();
    }

    if (files && files.length > 0) {
      const file = files[0];
      res.setHeader("Content-Type", file.contentType || "application/octet-stream");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      const downloadStream = bucket.openDownloadStream(objectId);
      downloadStream.pipe(res);
      return;
    }

    // 3. Fallback: buscar en la colección del modelo Image antigua
    const image = await Image.findById(id);

    if (!image) {
      res.status(404).json({ error: "Imagen no encontrada" });
      return;
    }

    res.setHeader("Content-Type", image.contentType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.end(image.data);
  } catch (error) {
    console.error("Error getting image:", error);
    res.status(500).json({ error: "Error al obtener la imagen" });
  }
};
