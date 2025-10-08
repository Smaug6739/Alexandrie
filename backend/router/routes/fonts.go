package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Fonts(app *app.App, router *gin.RouterGroup) {
	fontsCtrl := &controllers.Controller{app: app, authorizer: nil}
	fonts := router.Group("/fonts")
	fonts.Use(middlewares.Auth())
	fonts.POST("", utils.WP(fontsCtrl.UploadFont))
}
