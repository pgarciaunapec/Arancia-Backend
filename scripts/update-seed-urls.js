#!/usr/bin/env node
/*
  update-seed-urls.js - Replace all image URLs in menuSeed.ts with GridFS endpoints
*/

const fs = require('fs');
const path = require('path');

// read mapping
const mappingPath = path.resolve(__dirname, '..', 'uploads', 'image-mapping.json');
const seedPath = path.resolve(__dirname, '..', 'src', 'seeds', 'menuSeed.ts');

if (!fs.existsSync(mappingPath)) {
    console.error('❌ Mapping file not found:', mappingPath);
    process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
let content = fs.readFileSync(seedPath, 'utf8');

let replaced = 0;
for (const [oldUrl, id] of Object.entries(mapping)) {
    const newUrl = `http://localhost:5000/api/images/${id}`;
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matches = content.match(regex);
    if (matches) {
        replaced += matches.length;
        content = content.replace(regex, newUrl);
    }
}

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`✅ Replaced ${replaced} image URLs in menuSeed.ts`);
