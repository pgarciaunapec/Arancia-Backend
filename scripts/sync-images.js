#!/usr/bin/env node
/*
  sync-images.js

  - Collects image URLs from frontend data files (`src/data/menuData.ts`, `src/data/imageUrls.ts`)
  - Downloads each image to `backend/uploads/images/`
  - Stores the image in MongoDB using a simple `Image` model (filename, contentType, data)
  - Writes a mapping file `backend/uploads/image-mapping.json` with originalUrl -> imageId
  - Optionally updates frontend files to replace URLs with `${BACKEND_URL}/api/images/:id` when run with `--apply` and `--backendUrl`

  Usage:
    node scripts/sync-images.js [--apply] [--backendUrl=http://localhost:5000]

*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads', 'images');
const MAPPING_FILE = path.resolve(__dirname, '..', 'uploads', 'image-mapping.json');

const FRONTEND_MENU = process.env.FRONTEND_MENU || path.resolve(__dirname, '..', '..', 'src', 'data', 'menuData.ts');
const FRONTEND_IMAGES = process.env.FRONTEND_IMAGES || path.resolve(__dirname, '..', '..', 'src', 'data', 'imageUrls.ts');
const FRONTEND_DIR = process.env.FRONTEND_DIR || path.resolve(__dirname, '..', '..', 'src');

const argv = require('minimist')(process.argv.slice(2));
const APPLY = !!argv.apply;
const BACKEND_URL = argv.backendUrl || process.env.BACKEND_URL || '';

async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true });
}

function extractUrlsFromText(text) {
    const urlRegex = /https?:\/\/[^\"'\s)]+/g;
    const matches = text.match(urlRegex) || [];
    // filter common image hosts and remove query fragments that break filenames
    return matches.filter(u => /images\.unsplash\.com|lh3\.googleusercontent\.com|i\.ibb\.co|placehold\.co|googleusercontent\.com/.test(u));
}

async function downloadBuffer(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const buffer = Buffer.from(res.data);
        const contentType = res.headers['content-type'] || 'application/octet-stream';
        return { buffer, contentType };
    } catch (err) {
        console.error('Failed to download', url, err.message);
        return null;
    }
}

async function main() {
    console.log('🔎 Collecting image URLs from frontend files...');
    // collect frontend files (data files + all src pages/components)
    const allowedExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.json']);
    async function walk(dir) {
        const found = [];
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) {
                found.push(...await walk(full));
            } else {
                if (allowedExt.has(path.extname(e.name))) found.push(full);
            }
        }
        return found;
    }

    const filesFromSrc = fs.existsSync(FRONTEND_DIR) ? await walk(FRONTEND_DIR) : [];
    const files = Array.from(new Set([FRONTEND_MENU, FRONTEND_IMAGES, ...filesFromSrc]));
    const urls = new Set();

    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const text = await fs.promises.readFile(file, 'utf8');
        extractUrlsFromText(text).forEach(u => urls.add(u));
    }

    const urlList = Array.from(urls);
    console.log(`Found ${urlList.length} candidate image URLs`);

    await ensureDir(UPLOADS_DIR);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant01';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    const mapping = fs.existsSync(MAPPING_FILE) ? JSON.parse(await fs.promises.readFile(MAPPING_FILE, 'utf8')) : {};

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'images' });

    const FORCE = !!argv.force;
    const MIGRATE = !!argv.migrate; // migrate from existing `images` collection docs

    async function uploadToGridFS(filename, buffer, contentType) {
        return new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(filename, { contentType });
            uploadStream.on('error', (err) => reject(err));
            uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
            uploadStream.end(buffer);
        });
    }

    for (const url of urlList) {
        if (mapping[url] && !FORCE && !MIGRATE) {
            console.log('↩️  Already mapped:', url, '->', mapping[url]);
            continue;
        }

        // If migrate is requested and mapping exists, try to copy from old images collection
        if (MIGRATE && mapping[url]) {
            try {
                const oldId = mapping[url];
                const oldDoc = await mongoose.connection.db.collection('images').findOne({ _id: new mongoose.Types.ObjectId(oldId) });
                if (oldDoc && oldDoc.data) {
                    const buffer = oldDoc.data.buffer ? Buffer.from(oldDoc.data.buffer) : Buffer.from(oldDoc.data);
                    const newId = await uploadToGridFS(oldDoc.filename || `${Date.now()}.bin`, buffer, oldDoc.contentType || 'application/octet-stream');
                    mapping[url] = newId;
                    console.log('🔁 Migrated', url, 'to GridFS id', newId);
                    continue;
                }
            } catch (err) {
                console.warn('⚠️  Migration failed for', url, err.message || err);
            }
        }

        console.log('⬇️  Downloading', url);
        const result = await downloadBuffer(url);
        if (!result) continue;

        const { buffer, contentType } = result;

        // derive extension
        const extMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]{2,5})$/);
        const ext = extMatch ? extMatch[1] : (contentType.split('/')[1] || 'bin');
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const localPath = path.join(UPLOADS_DIR, safeName);

        await fs.promises.writeFile(localPath, buffer);
        console.log('💾 Saved local copy:', path.relative(process.cwd(), localPath));

        try {
            const newId = await uploadToGridFS(safeName, buffer, contentType);
            mapping[url] = newId;
            console.log('🗄️  Stored in GridFS with id', newId);
        } catch (err) {
            console.error('❌ Failed to store in GridFS for', url, err.message || err);
        }
    }

    await fs.promises.writeFile(MAPPING_FILE, JSON.stringify(mapping, null, 2));
    console.log('🗺️  Mapping saved to', path.relative(process.cwd(), MAPPING_FILE));

    if (APPLY) {
        if (!BACKEND_URL) {
            console.warn('--apply requested but no --backendUrl provided and BACKEND_URL env not set. Skipping file updates.');
        } else {
            console.log('♻️  Updating frontend files to point to backend image endpoints...');
            // update all collected frontend files
            for (const file of files) {
                if (!fs.existsSync(file)) continue;
                let text = await fs.promises.readFile(file, 'utf8');
                let changed = false;
                for (const [orig, id] of Object.entries(mapping)) {
                    const target = `${BACKEND_URL.replace(/\/$/, '')}/api/images/${id}`;
                    const escaped = orig.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
                    const re = new RegExp(escaped, 'g');
                    if (re.test(text)) {
                        text = text.replace(re, target);
                        changed = true;
                    }
                }
                if (changed) {
                    await fs.promises.writeFile(file, text, 'utf8');
                    console.log('🔁 Updated', path.relative(process.cwd(), file));
                }
            }
        }
    }

    console.log('✅ Done.');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
