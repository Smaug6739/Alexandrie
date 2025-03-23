package main

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/router"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	app := app.InitApp()
	defer app.DB.Close()

	app_router := router.InitRouter(app)
	// Recovery middleware recovers from any panics and writes a 500 if there was one.
	app_router.Use(gin.Recovery())

	app_router.Run("localhost:8080")
}
