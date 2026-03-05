# Alexandrie Backend

## Overview

The Alexandrie backend is a REST API built with Go and the Gin web framework. It provides authentication, nodes management, permissions, and file storage features with a layered architecture.

## Quick Start

```bash
# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Run database migrations
go run app/migrations/*.go

# Start the server
go run main.go
```

The API will be available at `http://localhost:8201` (or your configured port).

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

## Common Tasks

### Run the server

```bash
go run main.go
```

### Database migrations

Migrations are in the `app/migrations/` folder. They are automatically run on startup.

## Contributing

When contributing to the backend:

1. Follow the layered architecture pattern
1. Use prepared statements in repositories
1. Validate input in controllers
1. Keep business logic in services

See [CONTRIBUTING.md](../CONTRIBUTING.md) for full guidelines.
