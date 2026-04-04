import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Contact, EventRequest } from '../models/index';

const router = Router();

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email inválido'),
        body('message').trim().notEmpty().withMessage('El mensaje es requerido'),
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, email, phone, message } = req.body;

            const contact = await Contact.create({
                name,
                email,
                phone,
                message,
            });

            res.status(201).json({
                success: true,
                data: contact,
                message: 'Mensaje enviado correctamente. Te responderemos pronto.',
            });
        } catch (error) {
            console.error('Contact error:', error);
            res.status(500).json({ error: 'Error al enviar mensaje' });
        }
    }
);

// @route   POST /api/contact/event-quote
// @desc    Request event quote
// @access  Public
router.post(
    '/event-quote',
    [
        body('name').trim().notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email inválido'),
        body('phone').trim().notEmpty().withMessage('El teléfono es requerido'),
        body('eventType').notEmpty().withMessage('Tipo de evento requerido'),
        body('guests').isInt({ min: 1 }).withMessage('Número de invitados inválido'),
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, email, phone, eventType, packageName, guests, preferredDate, notes } = req.body;

            const eventRequest = await EventRequest.create({
                name,
                email,
                phone,
                eventType,
                packageName,
                guests,
                preferredDate: preferredDate ? new Date(preferredDate) : undefined,
                notes,
            });

            res.status(201).json({
                success: true,
                data: eventRequest,
                message: 'Solicitud de cotización recibida. Te contactaremos pronto.',
            });
        } catch (error) {
            console.error('Event quote error:', error);
            res.status(500).json({ error: 'Error al enviar solicitud' });
        }
    }
);

export default router;
