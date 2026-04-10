import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types/index";

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Autenticación requerida" });
      return;
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ error: "No tienes permisos para acceder a este recurso" });
      return;
    }

    next();
  };
};
