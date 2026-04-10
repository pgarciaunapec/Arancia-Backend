/**
 * Admin Middleware - Verify admin role
 */

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Autenticación requerida" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Se requieren permisos de administrador" });
    return;
  }

  next();
};
