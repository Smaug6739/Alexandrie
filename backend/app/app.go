package app

import (
	"Smaug6739/Alexandrie/utils"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type App struct {
	DB        *sql.DB
	Snowflake *utils.Snowflake
}

func InitApp() *App {
	var app App
	app.DB = DBConection()
	app.Snowflake = utils.NewSnowflake(1609459200000)

	return &app
}
