package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Auth(app *app.App, router *gin.RouterGroup) {
	auth := router.Group("/auth")

	authCtrl := controllers.NewAuthController(app)
	auth.POST("/", utils.WP(authCtrl.Login))
	auth.POST("/refresh", utils.WP(authCtrl.RefreshSession))
}
