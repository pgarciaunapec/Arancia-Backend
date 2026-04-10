import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { MenuItem } from '../models/MenuItem';

const checkImages = async () => {
    try {
        await connectDatabase();
        console.log('Connected to database...');

        const items = await MenuItem.find({});
        console.log(`Total items: ${items.length}`);

        const problematicItems = items.filter(item => !item.image || !item.image.includes('/api/images/'));

        console.log('Items with missing or non-local images:');
        problematicItems.forEach(item => {
            console.log(`- ${item.name}: ${item.image}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkImages();
