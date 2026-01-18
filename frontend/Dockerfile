# ============================================================================
# Dockerfile für Frontend (React + Vite)
# ============================================================================
# Multi-Stage Build für optimierte Image-Grösse
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Kopiere package files (für Caching)
COPY package*.json ./
RUN npm ci

# Kopiere Source-Code und baue
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Kopiere Build-Artefakte
COPY --from=build /app/dist .

# Kopiere nginx Konfiguration (optional, für SPA Routing)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponiere Port
EXPOSE 80

# Starte nginx
CMD ["nginx", "-g", "daemon off;"]
