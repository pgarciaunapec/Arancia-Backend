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

      const eventRequest = await EventRequest.create({
        name,
        email,
        phone,
        eventType,
        packageName: packageName || undefined,
        guests,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        notes,
      });

      sendSuccess(
        res,
        eventRequest,
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
