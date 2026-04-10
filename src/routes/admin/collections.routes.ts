import { Router } from "express";
import * as controller from "../../controllers/admin.collections.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Protect all admin collection routes
router.use(authMiddleware, requireRole(["admin"]));

// List available collections and counts
router.get("/", controller.listCollections);

// Records CRUD
router.get("/:collection", controller.listRecords);
router.get("/:collection/:id", controller.getRecord);
router.post("/:collection", controller.createRecord);
router.put("/:collection/:id", controller.updateRecord);
router.delete("/:collection/:id", controller.deleteRecord);

// Config for collection UI
router.get("/config/:collection", controller.getConfig);
router.put("/config/:collection", controller.updateConfig);

export default router;
