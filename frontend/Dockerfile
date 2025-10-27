# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier et installer dépendances
COPY package.json bun.lock ./
RUN npm install -g bun && bun install

# Copier le reste du code et builder
COPY . .
RUN bun run build

# ---- Runtime stage ----
FROM nginx:alpine AS runtime

# Copier le build statique vers Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port (optionnel, nginx écoute sur 80 par défaut)
EXPOSE 80

# Healthcheck (optionnel)
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:80 || exit 1

# Démarrage de nginx
CMD ["nginx", "-g", "daemon off;"]
