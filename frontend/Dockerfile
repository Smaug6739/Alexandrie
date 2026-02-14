# ========================================
# Build stage
# ========================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Dépendances (cacheable)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Code source
COPY . .

ENV NODE_ENV=production
RUN bun run build
# ========================================
# Runtime stage
# ========================================
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/.output /app/.output
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8200
CMD ["/app/docker-entrypoint.sh"]
