package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Uploads(app *app.App, router *gin.RouterGroup) {
	ressources := router.Group("/ressources")
	ressourcesCtrl := controllers.NewRessourceController(app)

	ressources.Use(middlewares.Auth())

	ressources.GET(("/:userId"), utils.WP(ressourcesCtrl.GetAllUploads))
	ressources.POST("", utils.WP(ressourcesCtrl.UploadFile))
	ressources.GET("/avatar", utils.WP(ressourcesCtrl.UploadAvatar))
	ressources.DELETE("/:id", utils.WP(ressourcesCtrl.DeleteUpload))
}
