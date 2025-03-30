package routes

import (
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterDocumentRoutes(router *gin.Engine, controller *controllers.Controller) {
	documents := router.Group("/documents")
	documents.Use(middlewares.Auth())

	documents.GET("/", controller.GetAllDocuments)
	documents.GET("/:id", controller.GetDocument)
	documents.POST("/", controller.AddDocument)
	documents.PATCH("/:id", controller.UpdateDocument)
	documents.DELETE("/:id", controller.DeleteDocument)
}
