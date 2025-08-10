package app

import (
	"alexandrie/services"
	"alexandrie/utils"
	"database/sql"

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
	User      services.UserService
	Session   services.AuthService
	Log       services.LogService
	Document  services.DocumentService
	Category  services.CategoryService
	Ressource services.RessourceService
	Minio     services.MinioService
}

type App struct {
	DB          *sql.DB
	Snowflake   *utils.Snowflake
	Config      Config
	MinioClient *minio.Client
	MailClient  *mail.Client
	Services    Services
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConection(config, false)
	app.MinioClient, _ = MinioConnection()
	app.MailClient = GetMailClient()
	app.Snowflake = utils.NewSnowflake(1609459200000)
	app.Config = config
	app.Services = Services{
		User:      services.NewUserService(app.DB),
		Session:   services.NewAuthService(app.DB),
		Log:       services.NewLogService(app.DB),
		Document:  services.NewDocumentService(app.DB),
		Category:  services.NewCategoryService(app.DB),
		Ressource: services.NewRessourceService(app.DB),
		Minio:     services.NewMinioService(app.MinioClient),
	}

	Migrate(&config)
	return &app
}
