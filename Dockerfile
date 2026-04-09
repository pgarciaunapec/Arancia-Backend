FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm (via corepack) and prepare
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy sources and install
COPY . .
RUN pnpm install --frozen-lockfile

# Build TypeScript output
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Allow overriding the runtime port via environment variable
ENV PORT=5000

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

# Copy built files and uploads
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

EXPOSE 5000
# Use the configured PORT and health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- "http://localhost:${PORT}/api/health" || exit 1

CMD ["node", "dist/server.js"]
