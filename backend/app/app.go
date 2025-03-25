package app

import (
	"Smaug6739/Alexandrie/utils"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
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
		MaxSize        float64
		MaxUploadsSize float64
	}
	Auth struct {
		AccessTokenExpiry  int
		RefreshTokenExpiry int
	}
}

type App struct {
	DB        *sql.DB
	Snowflake *utils.Snowflake
	Config    Config
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConection(config)
	app.Snowflake = utils.NewSnowflake(1609459200000)
	app.Config = config
	return &app
}
