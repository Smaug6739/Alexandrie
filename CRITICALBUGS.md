Critical Bugs in the repo

1. Resource Leak in GetAllNodeBackup (backend/services/node.service.go:176)
Missing defer rows.Close() after opening database rows. This can cause connection pool exhaustion.

Location: backend/services/node.service.go:176
Impact: Memory leak, database connection exhaustion
Fix needed: Add defer rows.Close() after line 175
2. SQL Injection via Dynamic Query Construction (backend/services/node.service.go:141)
The code builds a SQL query with dynamic placeholders using string concatenation, which could be vulnerable if not properly parameterized.

Location: backend/services/node.service.go:141
Risk: Medium (the implementation uses prepared statements, but the approach is risky)
3. Typo in Database Function Name (backend/app/database.go:10)
Function is named DBConection instead of DBConnection (missing 'n')

Location: backend/app/database.go:10
Impact: Consistency issue, but not functional
Security Concerns
4. Password Exposed in JSON Response (backend/models/user.model.go:13)
The User model includes Password field with json:"password,omitempty" tag, which could accidentally expose passwords in API responses if not carefully handled.

Location: backend/models/user.model.go:13
Impact: Potential password exposure
Note: The code does manually clear passwords (e.g., user.Password = "" in authentication.controller.go:88), but this is error-prone
5. Cookie Security Settings (backend/controllers/authentication.controller.go:86-87)
Cookies are set with secure: false, which means they can be transmitted over non-HTTPS connections.

Location: backend/controllers/authentication.controller.go:86-87
Impact: Session tokens could be intercepted on non-HTTPS connections
Recommendation: Use secure: true in production
Potential Race Conditions
6. Concurrent Background Task (backend/controllers/authentication.controller.go:30-35)
A goroutine is started in the controller constructor without proper shutdown mechanism, which could lead to resource leaks or orphaned goroutines.

Location: backend/controllers/authentication.controller.go:30-35
Impact: Potential goroutine leak
Data Consistency Issues
7. Missing Error Handling in Permission Check (backend/services/permissions.service.go:75)
The HasPermission function doesn't check the error from QueryRow().Scan(), which could lead to incorrect permission decisions if the query fails.

Location: backend/services/permissions.service.go:57-75
Impact: Could grant or deny access incorrectly on database errors
8. SQL Order Clause Quote Issue (backend/services/node.service.go:43)
The query has 'order' instead of backticks, which won't work as intended since ORDER is a SQL keyword.

Location: backend/services/node.service.go:43
Impact: Query syntax issue
Frontend Issues
9. Potential XSS Vulnerabilities
Multiple files use v-html directive, which could be vulnerable to XSS if content isn't properly sanitized.

Files affected: Multiple Vue components including markdown editors
Impact: XSS risk if user-generated content isn't sanitized
Minor Issues
10. Inconsistent Error Handling
Throughout the codebase, error handling is basic with generic error messages, which could make debugging difficult in production.