package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Uploads(app *app.App, router *gin.RouterGroup) {
	uploads := router.Group("/uploads")
	uploadsCtrl := controllers.NewUploadController(app)

	uploads.Use(middlewares.Auth())
	uploads.POST("/avatar", utils.WP(uploadsCtrl.UploadAvatar))
}
