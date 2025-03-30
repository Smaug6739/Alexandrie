package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/users")
	usrCtrl := controllers.NewController(app)

	usr.Use(middlewares.Auth())

	usr.GET("/", middlewares.Admin(), usrCtrl.GetUsers)
	usr.GET("/@me", usrCtrl.GetMe)
	usr.GET("/:id", middlewares.Admin(), usrCtrl.GetUserById)
	usr.POST("/", usrCtrl.CreateUser)
	usr.PATCH("/:id", usrCtrl.UpdateUser)
	usr.PATCH("/:id/password", usrCtrl.UpdatePassword)
}
