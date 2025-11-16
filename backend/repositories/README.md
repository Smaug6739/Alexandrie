# Repository Pattern Implementation

## Overview

This directory contains the repository layer implementation for the Alexandrie application. The repository pattern provides a clean abstraction between the business logic (services) and data access layer (database), with optimized prepared statements for better performance and security.

## Architecture

```
┌─────────────────┐
│   Controllers   │  ← HTTP Request Handlers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Business Logic Layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repositories   │  ← Data Access Layer (This layer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │  ← MySQL
└─────────────────┘
```

## Key Components

### 1. Repository Manager (`manager.go`)

The central component that manages all repositories and their prepared statements:

- **Lifecycle Management**: Initializes and closes all prepared statements
- **Statement Caching**: Reuses prepared statements across requests
- **Thread-Safe**: Uses mutex for concurrent access
- **Resource Cleanup**: Properly closes all statements on shutdown

```go
// Initialize repository manager
repoMgr, err := repositories.NewRepositoryManager(db)

// Get prepared statement count for monitoring
count := repoMgr.GetStatementCount()

// Graceful shutdown
repoMgr.Close()
```

### 2. Repository Interfaces (`interfaces.go`)

Defines contracts for all data access operations:

- `UserRepository` - User data operations
- `NodeRepository` - Note/document operations
- `SessionRepository` - Authentication session management
- `PermissionRepository` - Access control operations
- `LogRepository` - Connection and activity logging

### 3. Repository Implementations

Each repository implementation provides:

- **Prepared Statements**: All queries are prepared once at startup
- **Type Safety**: Strong typing with Go models
- **Error Handling**: Consistent error wrapping with context
- **Performance**: Optimized queries with proper indexing support

## Usage Example

### Application Initialization

```go
// Initialize with repository pattern
app, err := app.InitApp(config)
if err != nil {
    log.Fatal(err)
}
defer app.Close()  // Properly cleanup prepared statements

// Services now use optimized repositories
user, err := app.Services.User.GetUserById(userId)
```

## Database Indexing

For optimal performance with prepared statements, ensure these indexes exist:

```sql
-- User table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Nodes table
CREATE INDEX idx_nodes_user_id ON nodes(user_id);
CREATE INDEX idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX idx_nodes_accessibility ON nodes(accessibility);
CREATE INDEX idx_nodes_created ON nodes(created_timestamp);
CREATE INDEX idx_nodes_updated ON nodes(updated_timestamp);

-- Permissions table
CREATE INDEX idx_permissions_node_id ON permissions(node_id);
CREATE INDEX idx_permissions_user_id ON permissions(user_id);
CREATE INDEX idx_permissions_node_user ON permissions(node_id, user_id);

```

## Testing

Example test structure for repositories:

```go
func TestUserRepository_GetByID(t *testing.T) {
    // Setup test database
    db := setupTestDB()
    defer db.Close()

    // Initialize repository manager
    mgr, err := repositories.NewRepositoryManager(db)
    require.NoError(t, err)
    defer mgr.Close()

    // Test the repository
    user, err := mgr.User.GetByID(testUserID)
    assert.NoError(t, err)
    assert.Equal(t, "testuser", user.Username)
}
```

## Troubleshooting

### Issue: "prepared statement not found"

**Cause**: Repository manager not initialized or closed prematurely

**Solution**: Ensure repository manager is initialized before use and closed only on shutdown

```go
app, err := app.InitApp(config)
defer app.Close()  // Defer cleanup to end of main()
```

### Issue: High memory usage

**Cause**: Prepared statements hold memory for execution plans

**Solution**: This is expected and optimal. Each prepared statement uses ~1-5KB. Monitor with:

```go
log.Printf("Prepared statements: %d", app.GetStatementCount())
```
