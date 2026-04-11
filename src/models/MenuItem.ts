import mongoose, { Schema, Document } from 'mongoose';
import { IMenuItem } from '../types/index';

export interface IMenuItemDocument extends Omit<IMenuItem, '_id'>, Document { }

const menuItemSchema = new Schema<IMenuItemDocument>(
    {
        name: {
            type: String,
            required: [true, 'El nombre del plato es requerido'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            trim: true,
            index: true,
        },
        price: {
            type: Number,
            required: [true, 'El precio es requerido'],
            min: [0, 'El precio no puede ser negativo'],
        },
        ingredients: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [600, 'La descripción no puede exceder 600 caracteres'],
        },
        image: {
            type: String,
            required: [true, 'La imagen es requerida'],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for text search
menuItemSchema.index({ name: 'text', ingredients: 'text' });

export const MenuItem = mongoose.model<IMenuItemDocument>('MenuItem', menuItemSchema);
