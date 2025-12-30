package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Uploads(app *app.App, router *gin.RouterGroup) {
	resources := router.Group("/resources")
	resourcesCtrl := controllers.NewResourceController(app)

	resources.Use(middlewares.Auth())
	resources.GET(("/backup"), utils.WP(resourcesCtrl.GetBackup))
	resources.POST("", utils.WP(resourcesCtrl.UploadFile))
	resources.POST("/avatar", utils.WP(resourcesCtrl.UploadAvatar))
}
