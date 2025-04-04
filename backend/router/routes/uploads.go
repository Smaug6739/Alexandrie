package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"
	"Smaug6739/Alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Uploads(app *app.App, router *gin.RouterGroup) {
	uploads := router.Group("/uploads")
	uploadsCtrl := controllers.NewUploadController(app)

	uploads.Use(middlewares.Auth())
	uploads.POST("/avatar", utils.WP(uploadsCtrl.UploadAvatar))
}
