#!/usr/bin/env node
/**
 * Fix Image URLs in Menu Seed
 * 
 * Problema:
 * - El seed de menú tiene URLs hardcodeadas con localhost:5000
 * - Los IDs de imágenes pueden no existir en GridFS
 * - Necesitamos usar URLs relativas en lugar de URLs absolutas
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixMenuSeedImages() {
    try {
        console.log('📝 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const db = mongoose.connection.db;

        // Verificar imágenes en GridFS
        console.log('\n🔍 Buscando imágenes en GridFS...');
        let bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });
        const files = await bucket.find({}).toArray();
        console.log(`✅ Encontradas ${files.length} imágenes en GridFS`);

        if (files.length === 0) {
            console.warn('⚠️  No hay imágenes en GridFS');
            console.log('📌 Primero ejecuta: npm run sync:images');
            await mongoose.connection.close();
            return;
        }

        // Mostrar primeras imágenes
        console.log('\n📋 Primeras 5 imágenes disponibles:');
        files.slice(0, 5).forEach(f => {
            console.log(`  - ${f._id}: ${f.filename}`);
        });

        console.log('\n💾 Imágenes encontradas. Ahora necesitas:');
        console.log('1. Copiar los IDs anteriores');
        console.log('2. Actualizar src/seeds/menuSeed.ts con URLs como:');
        console.log('   image: "/api/images/{ID_COPIADO}"  ← URL relativa');
        console.log('\n⚠️  NO USES URLs ABSOLUTAS CON localhost!');
        console.log('✅ Las URLs relativas funcionarán en cualquier entorno.');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixMenuSeedImages();
