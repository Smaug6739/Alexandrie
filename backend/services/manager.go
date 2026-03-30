package services

import (
	"alexandrie/permissions"
	"alexandrie/pkg/logger"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"fmt"

	"github.com/minio/minio-go/v7"
)

type ServiceManager struct {
	Access       permissions.AccessGuard
	Auth         AuthService
	User         UserService
	Node         NodeService
	Permission   PermissionService
	Session      SessionService
	Minio        MinioService
	Resource     ResourceService
	Backup       BackupService
	OIDC         OIDCService
	UserSettings UserSettingsService
	initialized  bool
}

func NewServiceManager(repos *repositories.RepositoryManager, snowflake *snowflake.Snowflake, minioClient *minio.Client, resourceConfig ResourceConfig) (*ServiceManager, error) {
	sm := &ServiceManager{}

	if err := sm.initializeServices(repos, snowflake, minioClient, resourceConfig); err != nil {
		return nil, fmt.Errorf("failed to initialize services: %w", err)
	}

	sm.initialized = true
	logger.Success("Service manager", "Initialized successfully")
	return sm, nil
}

func (sm *ServiceManager) initializeServices(repos *repositories.RepositoryManager, snowflake *snowflake.Snowflake, minioClient *minio.Client, resourceConfig ResourceConfig) error {
	sm.Access = permissions.NewAccessGuard(repos.Node, repos.Permission)
	sm.Auth = NewAuthService(repos.User, repos.Session, repos.Log, snowflake)
	sm.User = NewUserService(repos.User, repos.Log, snowflake, sm.Access)
	sm.Minio = NewMinioService(minioClient)
	sm.Node = NewNodeService(repos.Node, repos.Permission, sm.Minio, snowflake, sm.Access)
	sm.Permission = NewPermissionService(repos.Permission, repos.Node, snowflake, sm.Access)
	sm.Session = NewSessionService(repos.Session)
	sm.Resource = NewResourceService(repos.Node, snowflake, minioClient, resourceConfig, sm.Access)
	sm.Backup = NewBackupService(repos.Node, repos.UserSettings)
	sm.OIDC = NewOIDCService(repos.OIDCProvider, repos.User, sm.User, repos.Session, repos.Log, snowflake)
	sm.UserSettings = NewUserSettingsService(repos.UserSettings)
	return nil
}

func (sm *ServiceManager) IsInitialized() bool {
	return sm.initialized
}
