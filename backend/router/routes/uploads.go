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

	uploads.GET(("/:userId"), utils.WP(uploadsCtrl.GetAllUploads))
	uploads.POST("", utils.WP(uploadsCtrl.UploadFile))
	uploads.GET("/avatar", utils.WP(uploadsCtrl.UploadAvatar))
	uploads.DELETE("/:id", utils.WP(uploadsCtrl.DeleteUpload))
}
