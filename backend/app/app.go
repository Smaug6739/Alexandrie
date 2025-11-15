package app

import (
	"alexandrie/repositories"
	"alexandrie/services"
	"alexandrie/utils"
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/minio/minio-go/v7"
	"github.com/wneessen/go-mail"
)

type Config struct {
	Port     int
	Database struct {
		Host   string
		Port   int
		Name   string
		Driver string
	}
	Cdn struct {
		MaxSize              float64
		MaxUploadsSize       float64
		SupportedTypesImages []string
		SupportedTypes       []string
	}
	Auth struct {
		AccessTokenExpiry  int
		RefreshTokenExpiry int
	}
}

type Services struct {
	Auth        services.AuthService
	User        services.UserService
	Node        services.NodeService
	Permission  services.PermissionService
	Log         services.LogService
	Session     services.SessionService
	Minio       services.MinioService
	Geolocation services.GeolocationService
	Ressource   services.RessourceService
}

type App struct {
	DB          *sql.DB
	Snowflake   *utils.Snowflake
	Config      Config
	MinioClient *minio.Client
	MailClient  *mail.Client
	Services    Services
	Repos       *repositories.RepositoryManager
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConnection(config, false)
	app.MinioClient, _ = MinioConnection()
	app.MailClient = GetMailClient()
	app.Snowflake = utils.NewSnowflake(1609459200000)
	app.Config = config

	// Initialize repositories
	repoManager, err := repositories.NewRepositoryManager(app.DB)
	if err != nil {
		log.Fatalf("Failed to initialize repository manager: %v", err)
	}
	app.Repos = repoManager

	// Initialize services
	app.Services = Services{
		Auth:        services.NewAuthService(repoManager.User, repoManager.Session, app.Snowflake),
		User:        services.NewUserService(repoManager.User, repoManager.Log, app.Snowflake),
		Node:        services.NewNodeService(repoManager.Node, repoManager.Permission, app.Snowflake),
		Permission:  services.NewPermissionService(repoManager.Permission, repoManager.Node, app.Snowflake),
		Log:         services.NewLogService(repoManager.Log, app.Snowflake),
		Session:     services.NewSessionService(repoManager.Session),
		Minio:       services.NewMinioService(app.MinioClient),
		Geolocation: services.NewGeolocationService(repoManager.Log),
		Ressource:   services.NewRessourceService(repoManager.Node, app.Snowflake),
	}

	Migrate(&config)
	return &app
}
