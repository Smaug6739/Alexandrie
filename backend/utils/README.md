# Utilities Layer

## Overview

The utilities layer provides reusable helper functions, constants, and tools used across the Alexandrie backend. These are stateless, pure functions that solve common problems.

## Available Utilities

### Snowflake ID Generator (`snowflake.go`)

Generates unique, distributed, time-ordered 64-bit IDs.

**Usage**:

```go
// Initialize (typically once at application start)
snowflake := utils.NewSnowflake(1)  // 1 is the machine ID

// Generate IDs
id1 := snowflake.Generate()  // e.g., 218914302160015361
id2 := snowflake.Generate()  // e.g., 218914302160015362

// Extract timestamp from ID
timestamp := snowflake.GetTimestamp(id1)
```

**Benefits**:

- Unique across distributed systems
- Time-ordered (sortable)
- 64-bit integers (database-friendly)
- Very fast generation (>10k/sec per instance)

**Structure**:

```
64 bits total:
├─ 41 bits: Timestamp (milliseconds since epoch)
├─ 10 bits: Machine ID (supports 1024 machines)
└─ 12 bits: Sequence (4096 IDs per millisecond per machine)
```

### Context Helper (`context.go`)

Extracts user and request info from Gin context.

```go
// Get user ID from context
userID, permission, err := utils.GetUserContext(ctx)
if err != nil {
    // Handle unauthenticated or error
}
```

### HTML Escape Utilities (`escape-html.go`)

Sanitize user input to prevent XSS attacks.

```go
// Escape HTML in user content
safeContent := utils.EscapeHTML(userInput)

// Example
input := `<script>alert('xss')</script>`
safe := utils.EscapeHTML(input)
// Result: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

### Domain Utilities (`domains.go`)

Manage application domains and environment variables.

SetDomainEnv initializes DOMAIN_CLIENT and COOKIE_DOMAIN environment variables
based on FRONTEND_URL (if defined).
If FRONTEND_URL is not set, the function does nothing.

**Examples:**

FRONTEND_URL=https://alexandrie-hub.fr
-> DOMAIN_CLIENT=https://alexandrie-hub.fr
-> COOKIE_DOMAIN=alexandrie-hub.fr

FRONTEND_URL=http://localhost:8200
-> DOMAIN_CLIENT=http://localhost:8200
-> COOKIE_DOMAIN=localhost

### Pointer Helpers (`pointers.go`)

Safely handle pointer conversions.

```go
// Convert value to pointer
strPtr := utils.StringPtr("hello")
intPtr := utils.IntPtr(42)
boolPtr := utils.BoolPtr(true)

// Convert pointer to value with default
str := utils.StringValue(strPtr, "default")
num := utils.IntValue(intPtr, 0)
flag := utils.BoolValue(boolPtr, false)

// Nil-safe operations
if utils.IsNil(ptr) {
    // Handle nil case
}
```

## Best Practices

### Keep Utilities Pure

Utilities should be stateless and have no side effects:

```go
// Good: Pure function
func FormatTimestamp(ts int64) string {
    return time.Unix(ts, 0).Format(time.RFC3339)
}

// Bad: Has side effects
func LogAndFormatTimestamp(ts int64) string {
    log.Println("Formatting timestamp")  // Side effect!
    return time.Unix(ts, 0).Format(time.RFC3339)
}
```

### Use Utility Constants

Define magic numbers as constants:

```go
// Bad
if user.Role == 2 {  // What does 2 mean?
    // ...
}

// Good
if user.Role == utils.UserRoleAdmin {
    // ...
}
```
