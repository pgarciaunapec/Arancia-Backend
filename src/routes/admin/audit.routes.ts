import { Router } from "express";
import { listAuditLogs } from "../../controllers/admin.collections.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router: import("express").Router = Router();

router.use(authMiddleware, requireRole(["admin"]));

router.get("/", listAuditLogs);

export default router;
