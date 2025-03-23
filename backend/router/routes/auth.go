package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"

	"github.com/gin-gonic/gin"
)

func Auth(app *app.App, router *gin.RouterGroup) {
	auth := router.Group("/auth")

	authCtrl := controllers.NewController(app)
	auth.POST("/", authCtrl.Login)
	auth.POST("/refresh", authCtrl.RefreshSession)

}
