# Controllers Layer

## Overview

Controllers handle HTTP requests and responses in the Alexandrie application. They act as the entry point for all API endpoints, validating input, calling appropriate services, and formatting responses.

## Architecture

```
┌─────────────────┐
│   HTTP Request  │  ← Client sends request
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Middleware    │  ← Auth, CORS, Logging
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controllers    │  ← Input validation & routing (This layer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repositories   │  ← Data access
└─────────────────┘
```

## Key Components

### Base Controller (`index.go`)

The foundation for all controllers, providing shared dependencies:

```go
type Controller struct {
    app        *app.App
    authorizer permissions.Authorizer
}
```

### Available Controllers

- **`authentication.controller.go`** - User login, registration, token refresh
- **`users.controller.go`** - User profile management, updates
- **`nodes.controller.go`** - Document/note CRUD operations
- **`permissions.controller.go`** - Access control management
- **`resources.controller.go`** - File upload and media handling

## Usage Example

### Controller Structure

```go
func (c *Controller) GetNodeById(ctx *fiber.Ctx) error {
    // 1. Extract and validate input
    nodeId, err := ctx.ParamsInt("id")
    if err != nil {
        return ctx.Status(400).JSON(fiber.Map{
            "error": "Invalid node ID",
        })
    }

    // 2. Call service layer
    node, err := c.app.Services.Node.GetNodeById(uint64(nodeId))
    if err != nil {
        return ctx.Status(404).JSON(fiber.Map{
            "error": "Node not found",
        })
    }

    // 3. Return formatted response
    return ctx.Status(200).JSON(node)
}
```

### Error Handling Pattern

Controllers should use consistent HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad request (validation error)
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not found
- **409** - Conflict (duplicate resource)
- **500** - Internal server error

## Best Practices

### Input Validation

Always validate user input at the controller level:

```go
// Validate required fields
if req.Username == "" || req.Password == "" {
    return ctx.Status(400).JSON(fiber.Map{
        "error": "Username and password required",
    })
}

// Validate format
if len(req.Username) < 3 || len(req.Username) > 25 {
    return ctx.Status(400).JSON(fiber.Map{
        "error": "Username must be 3-25 characters",
    })
}
```

### Request Body Parsing

Use Fiber's built-in parser with error handling:

```go
var req CreateNodeRequest
if err := ctx.BodyParser(&req); err != nil {
    return ctx.Status(400).JSON(fiber.Map{
        "error": "Invalid request body",
    })
}
```

### Authorization Checks

Use the authorizer for permission checks:

```go
// Check if user can access the node
if !c.authorizer.CanUserAccessNode(userId, nodeId, permission.Read) {
    return ctx.Status(403).JSON(fiber.Map{
        "error": "Access denied",
    })
}
```

## Common Issues

### Issue: "Cannot parse request body"

**Cause**: Incorrect Content-Type header or malformed JSON

**Solution**: Ensure client sends `Content-Type: application/json` and valid JSON:

```go
// Add better error message
if err := ctx.BodyParser(&req); err != nil {
    return ctx.Status(400).JSON(fiber.Map{
        "error": "Invalid JSON format",
        "details": err.Error(),
    })
}
```

### Issue: Middleware not executing

**Cause**: Route registered before middleware in router

**Solution**: Check `router/` directory - middleware must be registered before routes:

```go
// Correct order
app.Use(middlewares.AuthMiddleware)
app.Get("/nodes", controller.GetNodes)
```

### Issue: Context deadline exceeded

**Cause**: Long-running operations blocking the request

**Solution**: Set appropriate timeouts and use async operations for heavy tasks:

```go
// Add timeout to context
ctx.Context().SetTimeout(30 * time.Second)
```

## Testing Controllers

Example test structure:

```go
func TestGetNodeById(t *testing.T) {
    app := fiber.New()
    controller := NewController(testApp)

    app.Get("/nodes/:id", controller.GetNodeById)

    req := httptest.NewRequest("GET", "/nodes/123", nil)
    resp, err := app.Test(req)

    assert.NoError(t, err)
    assert.Equal(t, 200, resp.StatusCode)
}
```

## Response Format

Controllers should return consistent JSON responses:

```go
// Success response
{
    "data": { /* resource object */ },
    "message": "Operation successful"
}

// Error response
{
    "error": "Error message",
    "code": "ERROR_CODE"
}

// List response
{
    "data": [ /* array of resources */ ],
    "total": 100,
    "page": 1,
    "pageSize": 20
}
```
