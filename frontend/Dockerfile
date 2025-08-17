# Frontend Dockerfile for Alexandrie - Runtime build with build-time config
FROM node:20-alpine

# Install bun
RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    cp /root/.bun/bin/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -G appgroup -u 1001

WORKDIR /app

# Copy package files and install dependencies as root
COPY package.json bun.lock ./
RUN bun install

# Copy source code
COPY . .

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# Make script executable and change ownership to app user
RUN chmod +x /app/docker-entrypoint.sh && \
    chown -R appuser:appgroup /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8200/ || exit 1

# Runtime environment variables - can be overridden at container startup
ENV NODE_ENV=production
ENV PORT=8200
ENV VITE_BASE_API=""
ENV VITE_BASE_CDN=""
ENV NUXT_PUBLIC_BASE_URL=""

# Use entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]