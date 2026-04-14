import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import rateLimit from "express-rate-limit";
import * as controller from "../../controllers/admin.collections.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const typedRouter: import("express").Router = Router();

const uploadDir = path.resolve(process.cwd(), "uploads", "admin");
fs.mkdirSync(uploadDir, { recursive: true });

const assetUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "text/csv",
      "application/json",
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Tipo de archivo no permitido"));
      return;
    }
    cb(null, true);
  },
});

const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ["text/csv", "application/json"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Tipo de archivo no permitido"));
      return;
    }
    cb(null, true);
  },
});

const listLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const importLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Protect all admin collection routes
typedRouter.use(authMiddleware, requireRole(["admin"]));

// List available collections and counts
typedRouter.get("/", controller.listCollections);

// Collection UI configuration
typedRouter.get("/config/:collection", controller.getConfig);
typedRouter.put("/config/:collection", controller.updateConfig);

// Bulk and file operations
typedRouter.post("/:collection/bulk", controller.bulkAction);
typedRouter.post(
  "/:collection/import",
  importLimiter,
  importUpload.single("file"),
  controller.importRecords,
);
typedRouter.get("/:collection/export", controller.exportRecords);
typedRouter.post(
  "/:collection/:id/assets",
  assetUpload.single("file"),
  controller.uploadAsset,
);

// Records CRUD
typedRouter.get("/:collection", listLimiter, controller.listRecords);
typedRouter.get("/:collection/:id", controller.getRecord);
typedRouter.post("/:collection", controller.createRecord);
typedRouter.put("/:collection/:id", controller.updateRecord);
typedRouter.delete("/:collection/:id", controller.deleteRecord);

export default typedRouter;
