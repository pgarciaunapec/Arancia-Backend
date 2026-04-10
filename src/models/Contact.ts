import mongoose, { Schema, Document } from 'mongoose';
import { IContact, ContactStatus } from '../types/index';

export interface IContactDocument extends Omit<IContact, '_id'>, Document { }

const contactSchema = new Schema<IContactDocument>(
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
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'El mensaje es requerido'],
            maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres'],
        },
        status: {
            type: String,
            enum: ['unread', 'read', 'responded'] as ContactStatus[],
            default: 'unread',
        },
    },
    {
        timestamps: true,
    }
);

export const Contact = mongoose.model<IContactDocument>('Contact', contactSchema);
