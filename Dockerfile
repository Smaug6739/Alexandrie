# Multi-stage build for Alexandrie self-hosting
FROM node:20-alpine AS frontend-build

# Install bun - use curl method for better cross-platform support
RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/bun.lock ./

# Install dependencies
RUN bun install

# Copy frontend source
COPY frontend/ .

# Build frontend
RUN bun run build

# Backend build stage
FROM golang:1.23-alpine AS backend-build

WORKDIR /app/backend

# Copy backend go files
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY backend/ .

# Build backend
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend_app .

# Production stage
FROM alpine:latest

# Install required packages
RUN apk --no-cache add ca-certificates tzdata bash curl wget unzip

# Install Node.js and bun for frontend runtime
RUN apk add --no-cache nodejs npm && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Install MinIO server - detect architecture
RUN ARCH=$(uname -m) && \
    case $ARCH in \
        x86_64) MINIO_ARCH="amd64" ;; \
        aarch64) MINIO_ARCH="arm64" ;; \
        *) echo "Unsupported architecture: $ARCH" && exit 1 ;; \
    esac && \
    wget https://dl.min.io/server/minio/release/linux-${MINIO_ARCH}/minio -O /usr/local/bin/minio && \
    chmod +x /usr/local/bin/minio

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -G appgroup -u 1001

WORKDIR /app

# Copy built frontend from frontend-build stage
COPY --from=frontend-build --chown=appuser:appgroup /app/frontend/.output ./frontend/.output
COPY --from=frontend-build --chown=appuser:appgroup /app/frontend/package.json ./frontend/

# Copy built backend from backend-build stage
COPY --from=backend-build --chown=appuser:appgroup /app/backend/backend_app ./backend/
COPY --chown=appuser:appgroup backend/config.toml ./backend/
COPY --chown=appuser:appgroup backend/migrations ./backend/migrations/

# Create directories for MinIO data and MySQL data
RUN mkdir -p /app/data/minio /app/data/mysql && \
    chown -R appuser:appgroup /app

# Install MySQL client and netcat for database migrations and health checks
RUN apk add --no-cache mysql-client netcat-openbsd

# Install migrate tool for database migrations - detect architecture
RUN ARCH=$(uname -m) && \
    case $ARCH in \
        x86_64) MIGRATE_ARCH="amd64" ;; \
        aarch64) MIGRATE_ARCH="arm64" ;; \
        *) echo "Unsupported architecture: $ARCH" && exit 1 ;; \
    esac && \
    wget -O- https://github.com/golang-migrate/migrate/releases/latest/download/migrate.linux-${MIGRATE_ARCH}.tar.gz | tar xvz && \
    mv migrate /usr/local/bin/migrate

# Copy startup script
COPY --chown=appuser:appgroup start.sh /app/start.sh

RUN chmod +x /app/start.sh

# Switch to app user
USER appuser

# Expose ports
EXPOSE 8200 8201 9000 9001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8200/ || exit 1

# Default command
CMD ["/app/start.sh"]