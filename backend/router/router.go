package router

import (
	"alexandrie/app"
	"alexandrie/router/routes"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRouter(app *app.App) *gin.Engine {
	router := gin.New()

	router.Use(gin.Recovery())

	// Configurer les proxys et CORS
	router.SetTrustedProxies([]string{"127.0.0.1", "localhost"})
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("DOMAIN_CLIENT")},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	mainGroup := router.Group("/api")
	routes.Users(app, mainGroup)
	routes.Auth(app, mainGroup)
	routes.Uploads(app, mainGroup)
	routes.Documents(app, mainGroup)
	routes.Categories(app, mainGroup)
	return router
}
