const env = process.env;
env.JWT_SECRET = 'seed-run-secret';
env.MONGODB_URI = 'mongodb://mongo:Pantonio2404@129.213.147.180:27017';
const { spawnSync } = require('child_process');
const res = spawnSync('pnpm', ['run', 'seed:all'], { stdio: 'inherit', shell: true, env });
process.exit(res.status || 1);
