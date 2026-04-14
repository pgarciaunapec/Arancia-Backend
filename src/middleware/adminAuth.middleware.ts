/**
 * Admin Authorization Middleware
 * Verifies user has admin role and token is still valid
 * CRITICAL: Invalidates admin access if user role changed
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index';
import { sendError } from '../utils/response.util';
import { User } from '../models/User';

/**
 * Middleware to verify admin role with real-time role validation
 * Unlike basic adminMiddleware, this queries the database to verify
 * the user's current role (prevents role escalation attacks)
 */
export const adminAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      sendError(res, 'No autorizado', 401);
      return;
    }

    // Query database to verify CURRENT role (not just JWT claim)
    const currentUser = await User.findById(user.id).select('role');

    if (!currentUser) {
      sendError(res, 'Usuario no encontrado', 401);
      return;
    }

    // Verify user is still admin
    if (currentUser.role !== 'admin') {
      // User had admin token but role was revoked/changed
      sendError(
        res,
        'Acceso denegado: Tu rol ha sido modificado. Debes volver a iniciar sesión.',
        403,
      );
      return;
    }

    // Update request with verified user data
    req.user = {
      ...user,
      role: currentUser.role,
    };

    next();
  } catch (error) {
    sendError(res, 'Error de autorización', 500);
  }
};

export default adminAuthMiddleware;
