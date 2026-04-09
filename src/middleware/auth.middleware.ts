import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest } from "../types/index";
import { User } from "../models/User";

interface JwtPayload {
  id: string;
  email: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token de acceso requerido" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await User.findById(decoded.id).select("role");
    if (!user) {
      res.status(401).json({ error: "Usuario no encontrado" });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
    res.status(500).json({ error: "Error de autenticación" });
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

      const user = await User.findById(decoded.id).select("role");
      if (user) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: user.role,
        };
      }
    }

    next();
  } catch {
    next();
  }
};
