package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Documents(app *app.App, router *gin.RouterGroup) {
	doc := router.Group("/documents")
	docCtrl := controllers.NewDocumentController(app)

	doc.GET("/:userId", middlewares.Auth(), utils.WP(docCtrl.GetDocuments))
}
