/**
 * Contact Routes - Refactored
 */

import {
  Router,
  Request,
  Response,
  type Router as ExpressRouter,
} from "express";
import { ContactController } from "../controllers/index";
import { EventRequest } from "../models";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  validateYupBody,
  validateYupParams,
} from "../middleware/yupValidation.middleware";
import {
  createContactYupSchema,
  eventQuoteYupSchema,
  mongoIdParamYupSchema,
} from "../schemas/yup.schemas";
import { sendError, sendSuccess } from "../utils";

const router: ExpressRouter = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags:
 *       - Contacto
 */
router.post(
  "/",
  validateYupBody(createContactYupSchema),
  ContactController.create,
);

router.post(
  "/event-quote",
  validateYupBody(eventQuoteYupSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        email,
        phone,
        eventType,
        packageName,
        guests,
        preferredDate,
        notes,
      } = req.body;

      const guestsCount = Number(guests);
      if (!Number.isInteger(guestsCount) || guestsCount < 1) {
        sendError(res, "El número de invitados es inválido", 400);
        return;
      }

      const parsedPreferredDate = preferredDate
        ? new Date(preferredDate)
        : undefined;

      if (
        preferredDate &&
        (!parsedPreferredDate || Number.isNaN(parsedPreferredDate.getTime()))
      ) {
        sendError(res, "La fecha preferida no tiene un formato válido", 400);
        return;
      }

      const eventRequest = await EventRequest.create({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        eventType,
        packageName:
          typeof packageName === "string" && packageName.trim()
            ? packageName.trim()
            : undefined,
        guests: guestsCount,
        preferredDate: parsedPreferredDate,
        notes:
          typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
      });

      sendSuccess(
        res,
        {
          _id: eventRequest._id,
          status: eventRequest.status,
          createdAt: eventRequest.createdAt,
        },
        201,
        "Solicitud de cotización recibida. Te contactaremos pronto.",
      );
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 400);
        return;
      }
      sendError(res, "No se pudo registrar la solicitud de evento", 400);
    }
  },
);

/**
 * @swagger
 * /admin/contact:
 *   get:
 *     summary: Obtener todos los mensajes de contacto (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, adminMiddleware, ContactController.getAll);

/**
 * @swagger
 * /contact/:id:
 *   get:
 *     summary: Obtener un mensaje de contacto
 *     tags:
 *       - Contacto
 */
router.get(
  "/:id",
  validateYupParams(mongoIdParamYupSchema),
  ContactController.getById,
);

/**
 * @swagger
 * /contact/:id/status:
 *   put:
 *     summary: Actualizar estado de mensaje (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  ContactController.updateStatus,
);

/**
 * @swagger
 * /contact/:id:
 *   delete:
 *     summary: Eliminar un mensaje (admin)
 *     tags:
 *       - Contacto
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateYupParams(mongoIdParamYupSchema),
  ContactController.delete,
);

export default router;
