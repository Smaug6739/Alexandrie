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
	resources.POST("", utils.WP(resourcesCtrl.UploadFile))
	resources.POST("/avatar", utils.WP(resourcesCtrl.UploadAvatar))
}

func Backup(app *app.App, router *gin.RouterGroup) {
	backup := router.Group("/backup")
	backupCtrl := controllers.NewBackupController(app)

	backup.Use(middlewares.Auth())
	backup.POST("", utils.WP(backupCtrl.CreateBackup))
	backup.GET("/:jobId", utils.WP(backupCtrl.GetBackupStatus))
	backup.DELETE("/:jobId", utils.WP(backupCtrl.CancelBackup))
}
