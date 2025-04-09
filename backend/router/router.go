package router

import (
	"alexandrie/app"
	"alexandrie/router/routes"

	"github.com/gin-gonic/gin"
)

func InitRouter(app *app.App) *gin.Engine {
	router := gin.New()
	mainGroup := router.Group("/api")
	routes.Users(app, mainGroup)
	routes.Auth(app, mainGroup)
	routes.Uploads(app, mainGroup)
	routes.Documents(app, mainGroup)
	return router
}
