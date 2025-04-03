package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/users")
	usrCtrl := controllers.NewUserController(app)

	usr.Use()

	usr.GET("/", middlewares.Auth(), middlewares.Admin(), usrCtrl.GetUsers)
	usr.GET("/@me", middlewares.Auth(), usrCtrl.GetMe)
	usr.GET("/:id", middlewares.Auth(), middlewares.Admin(), usrCtrl.GetUserById)
	usr.POST("/", usrCtrl.CreateUser)
	usr.PATCH("/:id", middlewares.Auth(), usrCtrl.UpdateUser)
	usr.PATCH("/:id/password", middlewares.Auth(), usrCtrl.UpdatePassword)
}
