package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/users")
	usr.Use(middlewares.Auth())

	usrCtrl := controllers.NewController(app)
	usr.GET("/", middlewares.Admin(), usrCtrl.GetUsers)

}
