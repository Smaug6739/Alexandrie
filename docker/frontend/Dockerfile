# Frontend Dockerfile for Alexandrie - Build-time configuration with Caddy
FROM node:20-alpine AS builder

# Install bun 
RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build arguments for configuration
ARG NUXT_PUBLIC_BASE_API=https://api.alexandrie-hub.fr
ARG NUXT_PUBLIC_BASE_CDN=https://cdn.alexandrie-hub.fr
ARG NUXT_PUBLIC_BASE_URL=https://alexandrie-hub.fr

# Set build-time environment variables
ENV NODE_ENV=production
ENV NUXT_PUBLIC_BASE_API=$NUXT_PUBLIC_BASE_API
ENV NUXT_PUBLIC_BASE_CDN=$NUXT_PUBLIC_BASE_CDN
ENV NUXT_PUBLIC_BASE_URL=$NUXT_PUBLIC_BASE_URL
ENV VITE_BASE_API=$NUXT_PUBLIC_BASE_API
ENV VITE_BASE_CDN=$NUXT_PUBLIC_BASE_CDN

# Build the application
RUN bun run build

# Production stage with Caddy
FROM caddy:2-alpine

# Remove default Caddy files
RUN rm -rf /usr/share/caddy/*

# Copy built static files
COPY --from=builder /app/.output/public /usr/share/caddy

# Create Caddyfile
RUN echo -e ":8200 {\n\troot * /usr/share/caddy\n\tfile_server\n\ttry_files {path} /index.html\n}" > /etc/caddy/Caddyfile

# Expose port
EXPOSE 8200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8200/ || exit 1

# Default command
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]