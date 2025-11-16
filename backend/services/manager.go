package services

import (
	"alexandrie/repositories"
	"alexandrie/utils"
	"fmt"
	"log"

	"github.com/minio/minio-go/v7"
)

// ServiceManager manages all services and their dependencies
type ServiceManager struct {
	Auth        AuthService
	User        UserService
	Node        NodeService
	Permission  PermissionService
	Log         LogService
	Session     SessionService
	Minio       MinioService
	Ressource   RessourceService
	initialized bool
}

// NewServiceManager creates a new service manager and initializes all services
func NewServiceManager(repos *repositories.RepositoryManager, snowflake *utils.Snowflake, minioClient *minio.Client) (*ServiceManager, error) {
	sm := &ServiceManager{}

	if err := sm.initializeServices(repos, snowflake, minioClient); err != nil {
		return nil, fmt.Errorf("failed to initialize services: %w", err)
	}

	sm.initialized = true
	log.Println("✅ Service manager initialized successfully")
	return sm, nil
}

// initializeServices creates and initializes all service instances
func (sm *ServiceManager) initializeServices(repos *repositories.RepositoryManager, snowflake *utils.Snowflake, minioClient *minio.Client) error {
	// Initialize Auth Service
	sm.Auth = NewAuthService(repos.User, repos.Session, repos.Log, snowflake)

	// Initialize User Service
	sm.User = NewUserService(repos.User, repos.Log, snowflake)

	// Initialize Node Service
	sm.Node = NewNodeService(repos.Node, repos.Permission, snowflake)

	// Initialize Permission Service
	sm.Permission = NewPermissionService(repos.Permission, repos.Node, snowflake)

	// Initialize Log Service
	sm.Log = NewLogService(repos.Log, snowflake)

	// Initialize Session Service
	sm.Session = NewSessionService(repos.Session)

	// Initialize Minio Service
	sm.Minio = NewMinioService(minioClient)

	// Initialize Ressource Service
	sm.Ressource = NewRessourceService(repos.Node, snowflake)

	return nil
}

// IsInitialized returns whether the service manager is initialized
func (sm *ServiceManager) IsInitialized() bool {
	return sm.initialized
}
