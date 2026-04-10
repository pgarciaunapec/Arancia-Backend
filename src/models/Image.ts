import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
    filename: string;
    contentType: string;
    data: Buffer;
    createdAt: Date;
}

const ImageSchema: Schema = new Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Image = mongoose.model<IImage>('Image', ImageSchema);
