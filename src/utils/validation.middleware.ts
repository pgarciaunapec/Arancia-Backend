/**
 * Validation Middleware - Handle validation errors centrally
 */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "./response.util";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => ({
      field: error.param,
      message: error.msg,
    }));
    sendError(res, "Validación fallida", 400, { errors: formattedErrors });
    return;
  }
  next();
};

/**
 * Custom validation error handler for manual validations
 */
export const validateRequest = (errors: string[]): string | null => {
  return errors.length > 0 ? errors.join(", ") : null;
};
