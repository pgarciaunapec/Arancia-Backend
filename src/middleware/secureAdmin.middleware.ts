/**
 * Admin Security Middleware
 * Enhanced role verification and session invalidation
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index';
import { User } from '../models/User';

/**
 * Middleware avanzado para verificar permisos de admin
 * Invalida token si el usuario cambió de cuenta o perdió permisos
 */
export const secureAdminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    // Verificar que el usuario actual sea admin
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({
        error: 'Acceso denegado: solo administradores',
        code: 'INSUFFICIENT_PERMISSIONS',
      });
      return;
    }

    // Verificar que el usuario está activo
    if (!user.isActive) {
      res.status(403).json({
        error: 'Cuenta desactivada',
        code: 'ACCOUNT_INACTIVE',
      });
      return;
    }

    // Agregar el usuario actualizado al request para acceso posterior
    req.user.role = user.role;

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Error verificando permisos de admin',
    });
  }
};

/**
 * Middleware para invalidar sesión si hay cambio de rol
 * Se ejecuta al acceder a rutas /admin
 */
export const validateAdminAccessMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?.id || req.user.role !== 'admin') {
      // Enviar header de invalidación de token
      res.setHeader('X-Invalidate-Token', 'true');
      res.status(403).json({
        error: 'Sesión de admin inválida o expirada',
        code: 'ADMIN_SESSION_INVALID',
        shouldRedirect: '/admin/login',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Error validando sesión de admin',
    });
  }
};

/**
 * Middleware para registrar acceso a rutas admin (auditoría)
 */
export const auditAdminAccessMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const adminId = req.user?.id;
    const route = req.path;
    const method = req.method;

    // Log de acceso admin (puede integrarse con base de datos)
    console.log(
      `[ADMIN AUDIT] ${method} ${route} by user:${adminId} at ${new Date().toISOString()}`,
    );

    next();
  } catch (error) {
    next();
  }
};
