# ========================================
# Build stage
# ========================================
FROM node:22-alpine AS builder

# Install bun
RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    cp /root/.bun/bin/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
ENV NODE_ENV=production
RUN bun run build

# ========================================
# Runtime stage
# ========================================
FROM node:22-alpine AS runtime

WORKDIR /app
ENV PORT=${PORT}

COPY --from=builder /app/.output /app/.output
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8200
CMD ["/app/docker-entrypoint.sh"]
