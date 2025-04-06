package server

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/router"
	"fmt"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func SetupServer() (*gin.Engine, *app.App) {
	godotenv.Load()

	// Charger la configuration depuis config.toml
	config := app.Config{}
	_, err := toml.DecodeFile("config.toml", &config)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	// Initialiser l'application
	application := app.InitApp(config)

	// Créer le routeur
	appRouter := router.InitRouter(application)
	appRouter.Use(gin.Recovery())

	// Configurer les proxys et CORS
	appRouter.SetTrustedProxies([]string{"127.0.0.1", "localhost"})
	appRouter.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("DOMAIN_CLIENT")},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	return appRouter, application
}
