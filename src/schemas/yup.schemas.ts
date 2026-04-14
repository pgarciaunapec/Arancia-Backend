import * as yup from "yup";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]*$/;
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const registerYupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener entre 2 y 100 caracteres")
    .max(100, "El nombre debe tener entre 2 y 100 caracteres"),
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test("is-valid-phone", "Teléfono inválido", (value) =>
      value ? phoneRegex.test(value) : true,
    ),
  address: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : "")),
});

export const loginYupSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

export const updateProfileYupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener entre 2 y 100 caracteres")
    .max(100, "El nombre debe tener entre 2 y 100 caracteres"),
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test("is-valid-phone", "Teléfono inválido", (value) =>
      value ? phoneRegex.test(value) : true,
    ),
  address: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : "")),
});

export const changePasswordYupSchema = yup.object({
  currentPassword: yup.string().required("La contraseña actual es requerida"),
  newPassword: yup
    .string()
    .required("La nueva contraseña es requerida")
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

export const createReservationYupSchema = yup.object({
  date: yup
    .date()
    .typeError("La fecha debe ser válida")
    .required("La fecha es requerida"),
  time: yup
    .string()
    .trim()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "La hora debe estar en formato HH:MM",
    )
    .required("La hora es requerida"),
  guests: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .typeError("Los huéspedes deben estar entre 1 y 20")
    .min(1, "Los huéspedes deben estar entre 1 y 20")
    .max(20, "Los huéspedes deben estar entre 1 y 20")
    .required("Los huéspedes son requeridos"),
  name: yup.string().trim().required("El nombre es requerido"),
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: yup.string().trim().required("El teléfono es requerido"),
  notes: yup
    .string()
    .trim()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .nullable()
    .transform((value) => (value ? value : "")),
  location: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : "")),
});

export const updateReservationYupSchema = yup.object({
  date: yup.date().typeError("La fecha debe ser válida").optional(),
  time: yup
    .string()
    .trim()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "La hora debe estar en formato HH:MM",
    )
    .optional(),
  guests: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .typeError("Los huéspedes deben estar entre 1 y 20")
    .min(1, "Los huéspedes deben estar entre 1 y 20")
    .max(20, "Los huéspedes deben estar entre 1 y 20")
    .optional(),
  name: yup.string().trim().optional(),
  phone: yup.string().trim().optional(),
  notes: yup
    .string()
    .trim()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .optional(),
  status: yup
    .string()
    .oneOf(
      ["pending", "confirmed", "cancelled", "completed"],
      "Estado inválido",
    )
    .optional(),
  acceptAdditionalCharge: yup.boolean().optional(),
});

export const createContactYupSchema = yup.object({
  name: yup.string().trim().required("El nombre es requerido"),
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test("is-valid-phone", "Teléfono inválido", (value) =>
      value ? phoneRegex.test(value) : true,
    ),
  subject: yup
    .string()
    .trim()
    .required("El asunto es requerido")
    .max(140, "El asunto no puede exceder 140 caracteres"),
  message: yup
    .string()
    .trim()
    .required("El mensaje es requerido")
    .max(2000, "El mensaje no puede exceder 2000 caracteres"),
});

export const eventQuoteYupSchema = yup.object({
  name: yup.string().trim().required("El nombre es requerido"),
  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: yup.string().trim().required("El teléfono es requerido"),
  eventType: yup
    .string()
    .oneOf(
      ["social", "corporativo", "privado", "otro"],
      "Tipo de evento inválido",
    )
    .required("El tipo de evento es requerido"),
  packageName: yup
    .string()
    .oneOf(["Esencial", "Premium", "Elite", ""], "Paquete inválido")
    .optional(),
  guests: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .typeError("El número de invitados es inválido")
    .min(1, "El número de invitados es inválido")
    .required("El número de invitados es requerido"),
  preferredDate: yup.string().trim().optional(),
  notes: yup
    .string()
    .trim()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional(),
});

export const mongoIdParamYupSchema = yup.object({
  id: yup
    .string()
    .required("ID requerido")
    .matches(mongoIdRegex, "ID de MongoDB inválido"),
});

export const savedAddressYupSchema = yup.object({
  label: yup
    .string()
    .trim()
    .max(50, "La etiqueta no puede exceder 50 caracteres")
    .optional(),
  name: yup.string().trim().required("El nombre es requerido"),
  address: yup.string().trim().required("La dirección es requerida"),
  city: yup.string().trim().required("La ciudad es requerida"),
  zip: yup
    .string()
    .trim()
    .optional()
    .default("00000"),
  isDefault: yup.boolean().optional().default(false),
});

export const savedCardYupSchema = yup.object({
  label: yup
    .string()
    .trim()
    .max(50, "La etiqueta no puede exceder 50 caracteres")
    .optional(),
  last4: yup
    .string()
    .trim()
    .required("Últimos 4 dígitos son requeridos")
    .matches(/^\d{4}$/, "Los últimos 4 dígitos deben ser numéricos"),
  cardType: yup
    .string()
    .oneOf(["visa", "mastercard", "other"], "Tipo de tarjeta inválido")
    .optional()
    .default("other"),
  expiryMonth: yup
    .number()
    .typeError("Mes de expiración debe ser numérico")
    .min(1, "Mes de expiración debe estar entre 1 y 12")
    .max(12, "Mes de expiración debe estar entre 1 y 12")
    .required("Mes de expiración es requerido"),
  expiryYear: yup
    .number()
    .typeError("Año de expiración debe ser numérico")
    .min(2024, "Año de expiración debe ser actual o futuro")
    .required("Año de expiración es requerido"),
  isDefault: yup.boolean().optional().default(false),
});
