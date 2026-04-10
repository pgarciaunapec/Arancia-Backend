import { NextFunction, Request, Response } from "express";
import { AnyObjectSchema, ValidationError } from "yup";
import { sendError } from "../utils/response.util";

const normalizeYupErrors = (error: ValidationError) => {
  const errors: Array<{ field: string; message: string }> = [];

  if (error.inner.length > 0) {
    const seen = new Set<string>();

    for (const issue of error.inner) {
      const field = issue.path || "form";
      if (seen.has(field)) {
        continue;
      }
      seen.add(field);
      errors.push({
        field,
        message: issue.message,
      });
    }

    return errors;
  }

  return [
    {
      field: error.path || "form",
      message: error.message || "Datos inválidos",
    },
  ];
};

const validateWithSchema =
  (schema: AnyObjectSchema, source: "body" | "params" | "query") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        sendError(res, "Validación fallida", 400, {
          errors: normalizeYupErrors(error),
        });
        return;
      }

      sendError(res, "Error de validación", 400);
    }
  };

export const validateYupBody = (schema: AnyObjectSchema) =>
  validateWithSchema(schema, "body");

export const validateYupParams = (schema: AnyObjectSchema) =>
  validateWithSchema(schema, "params");

export const validateYupQuery = (schema: AnyObjectSchema) =>
  validateWithSchema(schema, "query");
