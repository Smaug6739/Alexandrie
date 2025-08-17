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

# Production stage - distroless
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nonroot:nonroot /app/backend_app ./
COPY --chown=nonroot:nonroot config.toml ./
COPY --chown=nonroot:nonroot migrations ./migrations/

# Expose port
EXPOSE 8201

# Default command
ENTRYPOINT ["./backend_app"]