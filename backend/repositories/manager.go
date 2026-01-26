package repositories

import (
	"alexandrie/pkg/logger"
	"database/sql"
	"fmt"
	"sync"
)

// RepositoryManager manages all repositories and their prepared statements
type RepositoryManager struct {
	db           *sql.DB
	User         UserRepository
	Node         NodeRepository
	Session      SessionRepository
	Permission   PermissionRepository
	Log          LogRepository
	OIDCProvider OIDCProviderRepository
	statements   map[string]*sql.Stmt
	stmtMutex    sync.RWMutex
	initialized  bool
}

// NewRepositoryManager creates a new repository manager and initializes all repositories
func NewRepositoryManager(db *sql.DB) (*RepositoryManager, error) {
	rm := &RepositoryManager{
		db:         db,
		statements: make(map[string]*sql.Stmt),
	}

	if err := rm.initializeRepositories(); err != nil {
		return nil, fmt.Errorf("failed to initialize repositories: %w", err)
	}

	rm.initialized = true
	logger.Success("Repository manager initialized successfully with prepared statements")
	return rm, nil
}

// initializeRepositories creates and initializes all repository instances
func (rm *RepositoryManager) initializeRepositories() error {
	var err error

	// Initialize User Repository
	rm.User, err = NewUserRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize user repository: %w", err)
	}

	// Initialize Node Repository
	rm.Node, err = NewNodeRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize node repository: %w", err)
	}

	// Initialize Session Repository
	rm.Session, err = NewSessionRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize session repository: %w", err)
	}

	// Initialize Permission Repository
	rm.Permission, err = NewPermissionRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize permission repository: %w", err)
	}

	// Initialize Log Repository
	rm.Log, err = NewLogRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize log repository: %w", err)
	}

	// Initialize OIDC Provider Repository
	rm.OIDCProvider, err = NewOIDCProviderRepository(rm.db, rm)
	if err != nil {
		return fmt.Errorf("failed to initialize OIDC provider repository: %w", err)
	}

	return nil
}

// PrepareStatement creates and caches a prepared statement
func (rm *RepositoryManager) PrepareStatement(key string, query string) (*sql.Stmt, error) {
	rm.stmtMutex.Lock()
	defer rm.stmtMutex.Unlock()

	// Check if statement already exists
	if stmt, exists := rm.statements[key]; exists {
		return stmt, nil
	}

	// Prepare new statement
	stmt, err := rm.db.Prepare(query)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare statement '%s': %w", key, err)
	}

	// Cache the statement
	rm.statements[key] = stmt
	return stmt, nil
}

// GetStatement retrieves a cached prepared statement
func (rm *RepositoryManager) GetStatement(key string) (*sql.Stmt, error) {
	rm.stmtMutex.RLock()
	defer rm.stmtMutex.RUnlock()

	stmt, exists := rm.statements[key]
	if !exists {
		return nil, fmt.Errorf("prepared statement '%s' not found", key)
	}
	return stmt, nil
}

// Close closes all prepared statements and cleans up resources
func (rm *RepositoryManager) Close() error {
	rm.stmtMutex.Lock()
	defer rm.stmtMutex.Unlock()

	var errors []error
	for key, stmt := range rm.statements {
		if err := stmt.Close(); err != nil {
			errors = append(errors, fmt.Errorf("failed to close statement '%s': %w", key, err))
		}
	}

	// Clear the statements map
	rm.statements = make(map[string]*sql.Stmt)
	rm.initialized = false

	if len(errors) > 0 {
		return fmt.Errorf("errors occurred while closing statements: %v", errors)
	}

	logger.Success("Repository manager closed successfully")
	return nil
}

// IsInitialized returns whether the repository manager is initialized
func (rm *RepositoryManager) IsInitialized() bool {
	return rm.initialized
}

// GetStatementCount returns the number of prepared statements
func (rm *RepositoryManager) GetStatementCount() int {
	rm.stmtMutex.RLock()
	defer rm.stmtMutex.RUnlock()
	return len(rm.statements)
}
