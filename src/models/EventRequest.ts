import mongoose, { Schema, Document } from 'mongoose';
import { IEventRequest, EventRequestStatus } from '../types/index';

export interface IEventRequestDocument extends Omit<IEventRequest, '_id'>, Document { }

const eventRequestSchema = new Schema<IEventRequestDocument>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'El teléfono es requerido'],
            trim: true,
        },
        eventType: {
            type: String,
            required: [true, 'El tipo de evento es requerido'],
            enum: ['social', 'corporativo', 'privado', 'otro'],
        },
        packageName: {
            type: String,
            enum: ['Esencial', 'Premium', 'Elite', null],
        },
        guests: {
            type: Number,
            required: [true, 'El número de invitados es requerido'],
            min: [1, 'Debe haber al menos 1 invitado'],
        },
        preferredDate: {
            type: Date,
        },
        notes: {
            type: String,
            maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres'],
        },
        status: {
            type: String,
            enum: ['pending', 'contacted', 'confirmed', 'cancelled'] as EventRequestStatus[],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export const EventRequest = mongoose.model<IEventRequestDocument>('EventRequest', eventRequestSchema);
