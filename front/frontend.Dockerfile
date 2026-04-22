# ============================================================
# Frontend Dockerfile - React (Create React App)
# ============================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Build de producción
RUN npm run build


# ============================================================
# Stage 2: Runtime
# ============================================================
FROM node:20-alpine

WORKDIR /app

# Servidor estático
RUN npm install -g serve

# Copiar build generado
COPY --from=builder /app/build ./build

# Exponer puerto
EXPOSE 3000

# Ejecutar
CMD ["serve", "-s", "build", "-l", "3000"]