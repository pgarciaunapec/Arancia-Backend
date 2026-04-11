/**
 * Validation Rules - Centralized validation definitions
 */

import { body, param, query, ValidationChain } from "express-validator";

/**
 * Auth Validation Rules
 */
export const validateRegister = (): ValidationChain[] => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("phone").optional().trim(),
  body("address").optional().trim(),
];

export const validateLogin = (): ValidationChain[] => [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

export const validateUpdateProfile = (): ValidationChain[] => [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("phone").optional().trim(),
  body("address").optional().trim(),
];

export const validateChangePassword = (): ValidationChain[] => [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

/**
 * MenuItem Validation Rules
 */
export const validateCreateMenuItem = (): ValidationChain[] => [
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("category").trim().notEmpty().withMessage("La categoría es requerida"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),
  body("ingredients")
    .isArray()
    .withMessage("Los ingredientes deben ser un array"),
  body("description").optional().trim().isLength({ max: 600 }),
  body("image").trim().notEmpty().withMessage("La imagen es requerida"),
  body("available").optional().isBoolean(),
];

/**
 * Order Validation Rules
 */
export const validateCreateOrder = (): ValidationChain[] => [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un item en la orden"),
  body("items.*.menuItem")
    .notEmpty()
    .withMessage("El ID del artículo de menú es requerido"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser al menos 1"),
  body("isDelivery").optional().isBoolean(),
  body("shippingAddress").optional().isObject(),
];

/**
 * Reservation Validation Rules
 */
export const validateCreateReservation = (): ValidationChain[] => [
  body("date").isISO8601().withMessage("La fecha debe ser válida"),
  body("time")
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("La hora debe estar en formato HH:MM"),
  body("guests")
    .isInt({ min: 1, max: 20 })
    .withMessage("Los huéspedes deben estar entre 1 y 20"),
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("phone").trim().notEmpty().withMessage("El teléfono es requerido"),
  body("notes").optional().trim().isLength({ max: 500 }),
  body("location").optional().trim(),
];

/**
 * Contact Validation Rules
 */
export const validateCreateContact = (): ValidationChain[] => [
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("subject").trim().notEmpty().withMessage("El asunto es requerido"),
  body("message").trim().notEmpty().withMessage("El mensaje es requerido"),
  body("phone").optional().trim(),
];

/**
 * ID Validation Rules
 */
export const validateMongoId = (): ValidationChain[] => [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("ID de MongoDB inválido"),
];
