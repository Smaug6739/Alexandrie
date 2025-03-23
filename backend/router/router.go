package router

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/router/routes"

	"github.com/gin-gonic/gin"
)

func InitRouter(app *app.App) *gin.Engine {
	router := gin.New()
	mainGroup := router.Group("/api")
	routes.Users(app, mainGroup)
	routes.Auth(app, mainGroup)
	return router
}
