# Services Layer

## Overview

The services layer contains the business logic of the Alexandrie application. Services orchestrate operations between repositories, enforce business rules, and handle complex workflows that span multiple data entities.

## Architecture

```
┌─────────────────┐
│   Controllers   │  ← HTTP Request Handlers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Business Logic Layer (This layer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repositories   │  ← Data Access Layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │  ← MySQL
└─────────────────┘
```

## Key Components

### Service Manager (`manager.go`)

**Initialization:**

```go
serviceMgr, err := services.NewServiceManager(repos, snowflake, minioClient)
if err != nil {
    log.Fatal(err)
}
```

### Available Services

- **`auth.service.go`** - Authentication, login, registration, token management
- **`user.service.go`** - User profile operations, validation, updates
- **`node.service.go`** - Document/note business logic, hierarchy management
- **`permission.service.go`** - Access control rules and authorization
- **`session.service.go`** - User session lifecycle management
- **`log.service.go`** - Activity and connection logging
- **`minio.service.go`** - Object storage operations
- **`ressource.service.go`** - File and media management

## Usage Example

### Service Implementation Pattern

```go
type NodeService interface {
    GetNodeById(id uint64) (*models.Node, error)
    CreateNode(node *models.Node) error
    UpdateNode(node *models.Node) error
    DeleteNode(id uint64) error
}

type nodeService struct {
    nodeRepo       repositories.NodeRepository
    permissionRepo repositories.PermissionRepository
    snowflake      *snowflake.Snowflake
}

func (s *nodeService) CreateNode(node *models.Node) error {
    // 1. Validate business rules
    if err := s.validateNode(node); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }

    // 2. Generate unique ID
    node.ID = s.snowflake.Generate()

    // 3. Perform repository operations
    if err := s.nodeRepo.Create(node); err != nil {
        return fmt.Errorf("failed to create node: %w", err)
    }

    // 4. Handle related operations (permissions, logs, etc.)
    if err := s.createDefaultPermissions(node); err != nil {
        return fmt.Errorf("failed to set permissions: %w", err)
    }

    return nil
}
```

### Cross-repos Communication

Services can depend on other repos for complex operations:

```go
// Permission service uses node service for validation
func (s *permissionService) GrantAccess(nodeId, userId uint64, level int) error {
    // Verify node exists
    node, err := s.nodeRepo.GetByID(nodeId)
    if err != nil {
        return fmt.Errorf("node not found: %w", err)
    }

    // Verify user exists
    user, err := s.userRepo.GetByID(userId)
    if err != nil {
        return fmt.Errorf("user not found: %w", err)
    }

    // Create permission
    permission := &models.Permission{
        NodeID: nodeId,
        UserID: userId,
        Level:  level,
    }

    return s.permissionRepo.Create(permission)
}
```

## Best Practices

### Business Rule Validation

Services enforce all business rules before data persistence:

```go
func (s *nodeService) validateNode(node *models.Node) error {
    // Check required fields
    if node.Name == "" {
        return errors.New("node name is required")
    }

    // Validate name length
    if len(node.Name) < 1 || len(node.Name) > 50 {
        return errors.New("node name must be 1-50 characters")
    }

    // Check parent exists if specified
    if node.ParentID != 0 {
        _, err := s.nodeRepo.GetByID(node.ParentID)
        if err != nil {
            return errors.New("parent node not found")
        }
    }

    return nil
}
```

### Error Wrapping

Provide context when wrapping errors:

```go
if err := s.nodeRepo.Create(node); err != nil {
    return fmt.Errorf("failed to create node '%s': %w", node.Name, err)
}
```

### Transaction Management

For operations spanning multiple repositories, use transactions:

```go
func (s *nodeService) MoveNode(nodeId, newParentId uint64) error {
    tx, err := s.db.Begin()
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Update node parent
    if err := s.nodeRepo.UpdateParent(tx, nodeId, newParentId); err != nil {
        return err
    }

    // Update hierarchy metadata
    if err := s.updateHierarchy(tx, nodeId); err != nil {
        return err
    }

    return tx.Commit()
}
```

## Common Patterns

### ID Generation

Use Snowflake for distributed unique IDs:

```go
func (s *nodeService) CreateNode(node *models.Node) error {
    node.ID = s.snowflake.Generate()
    node.CreatedTimestamp = time.Now().Unix()
    node.UpdatedTimestamp = time.Now().Unix()

    return s.nodeRepo.Create(node)
}
```

## Common Issues

### Issue: Circular dependency between services

**Cause**: Service A imports Service B, which imports Service A

**Solution**: Extract shared logic to a utility package or use interfaces:

```go
// Instead of importing the service, define an interface
type NodeValidator interface {
    Exists(id uint64) bool
}

// Pass interface in constructor
func NewPermissionService(nodeValidator NodeValidator) *permissionService {
    return &permissionService{validator: nodeValidator}
}
```

### Issue: Service grows too large

**Cause**: Single service handling too many responsibilities

**Solution**: Split into smaller, focused services (for future refactoring):

```go
// Instead of one large NodeService, split into:
- NodeService       // Basic CRUD
- NodeHierarchyService  // Parent/child operations
- NodeSearchService     // Search and filtering
- NodeExportService     // Export to PDF, Markdown, etc.
```

### Issue: Race conditions in concurrent operations

**Cause**: Multiple goroutines modifying shared state

**Solution**: Use proper locking or atomic operations:

```go
import "sync"

type nodeService struct {
    mu         sync.RWMutex
    cache      map[uint64]*models.Node
}

func (s *nodeService) GetFromCache(id uint64) *models.Node {
    s.mu.RLock()
    defer s.mu.RUnlock()
    return s.cache[id]
}
```

## Service Initialization

Services are initialized through the ServiceManager in the main application:

```go
// In main.go or app initialization
app, err := app.InitApp(config)
if err != nil {
    log.Fatal(err)
}

// Access services through app
user, err := app.Services.User.GetUserById(userId)
node, err := app.Services.Node.GetNodeById(nodeId)
```
