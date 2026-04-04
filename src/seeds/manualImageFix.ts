import mongoose from 'mongoose';
import axios from 'axios';
import { connectDatabase } from '../config/database';
import { MenuItem } from '../models/MenuItem';
import { Image } from '../models/Image';

const manualFixes = [
    { name: 'Majarete', url: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Filete de Pescado', url: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Camarones al Ajillo', url: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Frutas', url: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Coco al Horno', url: 'https://images.pexels.com/photos/5419205/pexels-photo-5419205.jpeg?auto=compress&cs=tinysrgb&w=600' }
];

const downloadImage = async (url: string): Promise<{ buffer: Buffer; contentType: string } | null> => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return {
            buffer: Buffer.from(response.data),
            contentType: response.headers['content-type']
        };
    } catch (error) {
        console.error(`Error downloading ${url}:`, error);
        return null;
    }
};

const fixImages = async () => {
    try {
        await connectDatabase();
        console.log('Connected to database for manual fix...');

        for (const fix of manualFixes) {
            const item = await MenuItem.findOne({ name: { $regex: new RegExp(fix.name, 'i') } });

            if (item) {
                console.log(`Fixing image for: ${item.name}`);
                const imageData = await downloadImage(fix.url);

                if (imageData) {
                    const newImage = await Image.create({
                        filename: `${item._id}_fix`,
                        contentType: imageData.contentType,
                        data: imageData.buffer
                    });

                    item.image = `/api/images/${newImage._id}`;
                    await item.save();
                    console.log(`Updated ${item.name} -> /api/images/${newImage._id}`);
                } else {
                    console.error(`Failed to download for ${item.name}`);
                }
            } else {
                console.warn(`Item not found containing: ${fix.name}`);
            }
        }

        console.log('Manual fix completed.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    }
};

fixImages();
