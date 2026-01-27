package repositories

import (
	"alexandrie/pkg/logger"

	"github.com/jmoiron/sqlx"
)

type RepositoryManager struct {
	db           *sqlx.DB
	User         UserRepository
	Node         NodeRepository
	Session      SessionRepository
	Permission   PermissionRepository
	Log          LogRepository
	OIDCProvider OIDCProviderRepository
	initialized  bool
}

func NewRepositoryManager(db *sqlx.DB) (*RepositoryManager, error) {
	rm := &RepositoryManager{
		db: db,
	}

	rm.initializeRepositories()
	rm.initialized = true
	logger.Success("Repository manager initialized successfully")
	return rm, nil
}

func (rm *RepositoryManager) initializeRepositories() {
	rm.User = NewUserRepository(rm.db)
	rm.Session = NewSessionRepository(rm.db)
	rm.Node = NewNodeRepository(rm.db)
	rm.Permission = NewPermissionRepository(rm.db)
	rm.Log = NewLogRepository(rm.db)
	rm.OIDCProvider = NewOIDCProviderRepository(rm.db)
}

func (rm *RepositoryManager) Close() error {
	rm.initialized = false
	logger.Success("Repository manager closed successfully")
	return rm.db.Close()
}

func (rm *RepositoryManager) IsInitialized() bool {
	return rm.initialized
}
