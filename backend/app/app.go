package app

import (
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/services"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
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

type App struct {
	DB           *sqlx.DB
	Snowflake    *snowflake.Snowflake
	Config       Config
	MinioClient  *minio.Client
	SignerClient *minio.Client
	MailClient   *mail.Client
	Services     *services.ServiceManager
	Repos        *repositories.RepositoryManager
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConnection(config, false)
	app.MinioClient, app.SignerClient, _ = MinioConnection()
	app.MailClient = GetMailClient()
	app.Snowflake = snowflake.NewSnowflake(1609459200000)
	app.Config = config

	// Run database migrations / schema creation
	Migrate(&config)

	// Initialize repository manager
	repoManager, err := repositories.NewRepositoryManager(app.DB)
	if err != nil {
		log.Fatalf("Failed to initialize repository manager: %v", err)
	}
	app.Repos = repoManager

	// Initialize service manager
	serviceManager, err := services.NewServiceManager(repoManager, app.Snowflake, app.MinioClient)
	if err != nil {
		log.Fatalf("Failed to initialize service manager: %v", err)
	}
	app.Services = serviceManager

	return &app
}
