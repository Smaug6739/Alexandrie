package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	documents := router.Group("/users")
	documents.Use(middlewares.Auth())

	documentsCtrl := controllers.NewUserController(app)
	documents.GET("/", documentsCtrl.GetUsers)

}
