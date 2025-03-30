package app

import (
	"Smaug6739/Alexandrie/utils"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/minio/minio-go/v7"
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
	DB          *sql.DB
	Snowflake   *utils.Snowflake
	Config      Config
	MinioClient *minio.Client
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConection(config)
	app.MinioClient, _ = MinioConnection()
	app.Snowflake = utils.NewSnowflake(1609459200000)
	app.Config = config

	return &app
}
