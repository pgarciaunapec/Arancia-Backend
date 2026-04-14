# ========================================
# ARANCIA BACKEND - DOCKERFILE
# Variabilizado con ARG para Build-time y ENV para Runtime
# ========================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments (valores por defecto proporcionados)
ARG NODE_ENV=production

# Configurar environment en build
ENV NODE_ENV=${NODE_ENV}

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# ========================================
# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Runtime arguments (valores por defecto)
ARG PORT=3003
ARG NODE_ENV=production
ARG JWT_EXPIRES_IN=7d

# Set runtime environment variables
ENV PORT=${PORT} \
    NODE_ENV=${NODE_ENV} \
    JWT_EXPIRES_IN=${JWT_EXPIRES_IN}

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory if needed
RUN mkdir -p uploads

# Expose port (usando variable definida)
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}/api', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/server.js"]
