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

	doc.GET("/all", middlewares.Auth(), utils.WP(docCtrl.GetDocuments))
	doc.GET("/:id", middlewares.Auth(), utils.WP(docCtrl.GetDocument))
	doc.POST("/", middlewares.Auth(), utils.WP(docCtrl.CreateDocument))
	doc.PUT("/:id", middlewares.Auth(), utils.WP(docCtrl.UpdateDocument))
	doc.DELETE("/:id", middlewares.Auth(), utils.WP(docCtrl.DeleteDocument))
}
