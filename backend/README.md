# Alexandrie Backend

## Overview

The Alexandrie backend is a REST API built with Go and the Gin web framework. It provides authentication, nodes management, permissions, and file storage capabilities with a layered architecture.

## Quick Start

```bash
# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Run database migrations
go run migrations/*.go

# Start the server
go run main.go
```

The API will be available at `http://localhost:8201` (or your configured port).

## Architecture Layers

The backend follows a **clean layered architecture**:

1. **Router** → Routes HTTP requests to controllers
2. **Middlewares** → Authentication, logging, CORS
3. **Controllers** → Parse requests, call services, format responses
4. **Services** → Business logic and validation
5. **Repositories** → Database queries with prepared statements
6. **Models** → Data structures

Each layer has a specific responsibility and communicates only with adjacent layers.

## Configuration

Key environment variables in `.env`:

```env
# Server
BACKEND_PORT=8201
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=user:password@tcp(localhost:3306)/alexandrie

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Object Storage (MinIO/S3) (optional)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## Starting Points

### Adding a New Feature

1. **Define the model** in `models/` (data structure)
2. **Create repository** in `repositories/` (database queries)
3. **Implement service** in `services/` (business logic)
4. **Add controller** in `controllers/` (HTTP handlers)
5. **Register routes** in `router/routes/`

### Understanding Request Flow

```
HTTP Request
    ↓
router/router.go (route matching)
    ↓
middlewares/ (auth, logging)
    ↓
controllers/ (parse & validate)
    ↓
services/ (business logic)
    ↓
repositories/ (database)
    ↓
Response
```

### Code Entry Points

- **`main.go`** - Application startup
- **`app/app.go`** - App initialization (DB, services, repositories)
- **`server/server.go`** - HTTP server setup
- **`router/router.go`** - Route configuration

## Common Tasks

### Run the server

```bash
go run main.go
```

### Database migrations

Migrations are in the `migrations/` folder. They are automatically run on startup.

## Detailed Documentation

Each layer has detailed documentation:

- **[Controllers](./controllers/README.md)** - HTTP handlers and request validation
- **[Services](./services/README.md)** - Business logic implementation
- **[Repositories](./repositories/README.md)** - Database access patterns
- **[Models](./models/README.md)** - Data structures and validation
- **[Utils](./utils/README.md)** - Helper functions and utilities

## Dependencies

Key Go packages used:

- **[gin-gonic/gin](https://github.com/gin-gonic/gin)** - Web framework
- **[golang-jwt/jwt](https://github.com/golang-jwt/jwt)** - JWT authentication
- **[go-sql-driver/mysql](https://github.com/go-sql-driver/mysql)** - MySQL driver
- **[minio/minio-go](https://github.com/minio/minio-go)** - S3-compatible storage
- **[joho/godotenv](https://github.com/joho/godotenv)** - Environment variables

## Contributing

When contributing to the backend:

1. Follow the layered architecture pattern
2. Update relevant README files
3. Use prepared statements in repositories
4. Validate input in controllers
5. Keep business logic in services

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full guidelines.
