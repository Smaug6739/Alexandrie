package documents

import (
	"Smaug6739/Alexandrie/controllers"

	"github.com/gin-gonic/gin"
)

func Routes(router *gin.RouterGroup) {
	documents := router.Group("/documents")

	documents.GET("/", controllers.GetDocument)

}