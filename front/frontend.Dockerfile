# ============================================================
# Frontend Dockerfile - React + Vite + Bun
# Emergency Management System
# ============================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar Bun
RUN npm install -g bun

# Copiar archivos de package
COPY package*.json ./
COPY bunfig.toml* ./

# Instalar dependencias con Bun
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY src ./src
COPY public ./public
COPY vite.config.js ./
COPY index.html ./
COPY .env.example ./

# Build de la aplicación
ARG VITE_API_URL=http://localhost:5000
ARG VITE_GOOGLE_MAPS_API_KEY=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

RUN bun run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar servidor simple para servir archivos estáticos
RUN npm install -g serve

# Copiar archivos construidos desde el builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
