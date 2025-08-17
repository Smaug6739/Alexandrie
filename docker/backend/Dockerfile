# Backend Dockerfile for Alexandrie
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend_app .

# Production stage
FROM alpine:latest

# Install required packages
RUN apk --no-cache add ca-certificates tzdata mysql-client netcat-openbsd wget

# Install migrate tool for database migrations - detect architecture
RUN ARCH=$(uname -m) && \
    case $ARCH in \
        x86_64) MIGRATE_ARCH="amd64" ;; \
        aarch64) MIGRATE_ARCH="arm64" ;; \
        *) echo "Unsupported architecture: $ARCH" && exit 1 ;; \
    esac && \
    wget -O- https://github.com/golang-migrate/migrate/releases/latest/download/migrate.linux-${MIGRATE_ARCH}.tar.gz | tar xvz && \
    mv migrate /usr/local/bin/migrate

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -G appgroup -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=appuser:appgroup /app/backend_app ./
COPY --chown=appuser:appgroup config.toml ./
COPY --chown=appuser:appgroup migrations ./migrations/

# Switch to app user
USER appuser

# Expose port
EXPOSE 8201

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD nc -z localhost 8201 || exit 1

# Default command
CMD ["./backend_app"]