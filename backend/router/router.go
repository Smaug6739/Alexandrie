package router

import (
	documents "Smaug6739/Alexandrie/router/routes"

	"github.com/gin-gonic/gin"
)

func Init() {
	router := NewRouter()
	router.Run(":8080")
}

func NewRouter() *gin.Engine {
	router := gin.New()
	mainGroup := router.Group("/api")
	documents.Routes(mainGroup)
	return router
}