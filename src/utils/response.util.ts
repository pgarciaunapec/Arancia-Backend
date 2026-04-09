/**
 * Response Handler Utility - Standardized API responses
 */

import { Response } from "express";
import { SuccessResponseDTO, ErrorResponseDTO } from "../dtos/index";

/**
 * Send a success response with consistent format
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
): void => {
  const response: SuccessResponseDTO<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.status(statusCode).json(response);
};

/**
 * Send an error response with consistent format
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>,
): void => {
  const response: ErrorResponseDTO = {
    success: false,
    error: message,
    ...(details && { details }),
  };
  res.status(statusCode).json(response);
};

/**
 * Handle async route errors uniformly
 */
export const asyncHandler = (
  fn: (req: any, res: Response) => Promise<void>,
) => {
  return async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error("Request error:", error);
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, "Internal server error", 500);
      }
    }
  };
};
