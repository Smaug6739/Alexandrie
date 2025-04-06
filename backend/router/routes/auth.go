package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Auth(app *app.App, router *gin.RouterGroup) {
	auth := router.Group("/auth")

	authCtrl := controllers.NewAuthController(app)
	auth.POST("/", utils.WP(authCtrl.Login))
	auth.POST("/refresh", utils.WP(authCtrl.RefreshSession))

}
