# Models Layer

## Overview

Models define the data structures used throughout the Alexandrie application. They represent database tables, API request/response formats, and business entities with their properties and relationships.

## Architecture

```
┌─────────────────┐
│    Database     │
└────────┬────────┘
         │ Maps to
         ▼
┌─────────────────┐
│     Models      │  ← Data structures (This layer)
└────────┬────────┘
         │ Used by
         ▼
┌─────────────────┐
│  Repositories   │
│    Services     │
│   Controllers   │
└─────────────────┘
```

## JSON Serialization

### Excluding Fields from JSON

Use `json:"-"` to hide sensitive data:

```go
type User struct {
    Password string `json:"-"`  // Never included in JSON
    Email    string `json:"email,omitempty"`  // Omit if empty
}
```

### Custom JSON Field Names

```go
type Node struct {
    CreatedTimestamp int64 `json:"created_at"`  // Maps to "created_at" in JSON
    UpdatedTimestamp int64 `json:"updated_at"`
}
```

## Database Tags

Models use struct tags for database mapping:

```go
type User struct {
    ID       uint64 `json:"id" db:"id"`
    Username string `json:"username" db:"username" validate:"required,min=3,max=25"`
}
```

## Validation

### Built-in Validation

Use validation tags for automatic checks:

```go
type CreateUserRequest struct {
    Username  string `json:"username" validate:"required,min=3,max=25"`
    Email     string `json:"email" validate:"required,email"`
    Password  string `json:"password" validate:"required,min=8"`
}

// In controller/service
if err := validator.Validate(request); err != nil {
    return fmt.Errorf("validation error: %w", err)
}
```

## Request/Response DTOs

### Separate DTOs from Models

Create specific types for API requests/responses:

```go
// Request DTO
type CreateNodeRequest struct {
    Name        string `json:"name" validate:"required,max=50"`
    ParentID    uint64 `json:"parent_id"`
    Role        int    `json:"role" validate:"required,min=1,max=4"`
    Content     string `json:"content"`
}

// Response DTO
type NodeResponse struct {
    ID          uint64 `json:"id"`
    Name        string `json:"name"`
    CreatedAt   int64  `json:"created_at"`
    Owner       string `json:"owner"`
}

// Convert model to response
func ToNodeResponse(node *Node, ownerName string) NodeResponse {
    return NodeResponse{
        ID:        node.ID,
        Name:      node.Name,
        CreatedAt: node.CreatedTimestamp,
        Owner:     ownerName,
    }
}
```

## Common Issues

### Issue: "json: unsupported type" error

**Cause**: Trying to serialize unsupported types (channels, functions)

**Solution**: Use proper JSON-serializable types:

```go
// Wrong
type Node struct {
    Metadata chan string  // Cannot serialize
}

// Correct
type Node struct {
    Metadata interface{}  // Use json.RawMessage or map[string]interface{}
}
```

### Issue: Circular reference during JSON serialization

**Cause**: Model references itself or creates a cycle

**Solution**: Use pointers and omit empty, or create response DTOs:

```go
// Problematic
type Node struct {
    Parent   *Node
    Children []Node  // Causes infinite loop
}

// Better
type Node struct {
    ParentID uint64
    // Load children separately when needed
}
```

### Issue: Zero values being serialized

**Cause**: Not using `omitempty` tag

**Solution**: Add `omitempty` for optional fields:

```go
type Node struct {
    ParentID    uint64 `json:"parent_id,omitempty"`
    Description string `json:"description,omitempty"`
}
```
