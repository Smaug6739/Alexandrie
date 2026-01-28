package services

import (
	"alexandrie/pkg/logger"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"fmt"

	"github.com/minio/minio-go/v7"
)

// ServiceManager manages all services and their dependencies
type ServiceManager struct {
	Auth        AuthService
	User        UserService
	Node        NodeService
	Permission  PermissionService
	Session     SessionService
	Minio       MinioService
	Resource    ResourceService
	Backup      BackupService
	OIDC        OIDCService
	initialized bool
}

// NewServiceManager creates a new service manager and initializes all services
func NewServiceManager(repos *repositories.RepositoryManager, snowflake *snowflake.Snowflake, minioClient *minio.Client) (*ServiceManager, error) {
	sm := &ServiceManager{}

	if err := sm.initializeServices(repos, snowflake, minioClient); err != nil {
		return nil, fmt.Errorf("failed to initialize services: %w", err)
	}

	sm.initialized = true
	logger.Success("Service manager", "Initialized successfully")
	return sm, nil
}

// initializeServices creates and initializes all service instances
func (sm *ServiceManager) initializeServices(repos *repositories.RepositoryManager, snowflake *snowflake.Snowflake, minioClient *minio.Client) error {
	// Initialize Auth Service
	sm.Auth = NewAuthService(repos.User, repos.Session, repos.Log, snowflake)

	// Initialize User Service
	sm.User = NewUserService(repos.User, repos.Log, snowflake)

	// Initialize Minio Service (must be initialized before NodeService)
	sm.Minio = NewMinioService(minioClient)

	// Initialize Node Service (depends on MinioService for file cleanup)
	sm.Node = NewNodeService(repos.Node, repos.Permission, sm.Minio, snowflake)

	// Initialize Permission Service
	sm.Permission = NewPermissionService(repos.Permission, repos.Node, snowflake)

	// Initialize Session Service
	sm.Session = NewSessionService(repos.Session)

	// Initialize Resource Service
	sm.Resource = NewResourceService(repos.Node, snowflake)

	// Initialize Backup Service
	sm.Backup = NewBackupService(repos.Node)

	// Initialize OIDC Service
	sm.OIDC = NewOIDCService(repos.OIDCProvider, repos.User, sm.User, repos.Session, repos.Log, snowflake)

	return nil
}

// IsInitialized returns whether the service manager is initialized
func (sm *ServiceManager) IsInitialized() bool {
	return sm.initialized
}
