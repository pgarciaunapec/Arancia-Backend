const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const env = Object.assign({}, process.env, {
    JWT_SECRET: 'seed-run-secret',
    MONGODB_URI: 'mongodb://mongo:Pantonio2404@129.213.147.180:27017'
});

console.log('Running pnpm run seed:all with env MONGODB_URI=' + env.MONGODB_URI);
const res = spawnSync('pnpm', ['run', 'seed:all'], { env, shell: true, encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 });
const out = res.stdout || '';
const err = res.stderr || '';
const content = (out + '\n' + err).replace(/\r/g, '');
const logPath = path.join(process.cwd(), 'seed_full.log');
try {
    fs.writeFileSync(logPath, content, 'utf8');
    console.log('Wrote full log to', logPath);
} catch (e) {
    console.error('Failed to write seed_full.log:', e && e.stack ? e.stack : e);
}

if (out) console.log(out);
if (err) console.error(err);

// Extract relevant lines
console.log('\n=== Matching lines (connected/inserted/menu/download/store/update/migrate/image/Mongo) ===');
const matches = content.split(/\n/).filter(line => /connected|inserted|\bmenu\b|download|store|update|migrate|migration|image|Mongo/i.test(line));
if (matches.length) matches.forEach(l => console.log(l)); else console.log('(no matching lines)');

// Print last 200 lines
console.log('\n=== Last 200 lines of seed log ===');
const lines = content.split(/\n/);
const last = lines.slice(-200);
last.forEach(l => console.log(l));

process.exit(res.status || (res.error ? 1 : 0));
