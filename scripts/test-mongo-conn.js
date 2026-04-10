#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const path = require('path');

const fileCA = path.resolve(__dirname, '..', 'mongo-cert.crt');

async function test(uri, options = {}) {
    console.log('\n---\nTrying URI:', uri);
    console.log('Options:', Object.keys(options).length ? options : '{}');
    try {
        await mongoose.connect(uri, {
            ...options,
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected successfully');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Connect error:', err && err.message ? err.message : err);
    }
}

async function run() {
    const envUri = process.env.MONGODB_URI;
    if (!envUri) {
        console.error('No MONGODB_URI found in environment');
        process.exit(1);
    }

    await test(envUri);

    const withAuthSource = envUri + (envUri.includes('?') ? '&' : '?') + 'authSource=admin';
    await test(withAuthSource);

    const withTLS = envUri + (envUri.includes('?') ? '&' : '?') + 'tls=true&authSource=admin';
    await test(withTLS, { tlsCAFile: fileCA, tlsAllowInvalidCertificates: true, tls: true });
}

run().then(() => process.exit(0));
