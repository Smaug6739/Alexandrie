package routes

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/controllers"
	"Smaug6739/Alexandrie/middlewares"
	"Smaug6739/Alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/users")
	usrCtrl := controllers.NewUserController(app)

	usr.Use()

	usr.GET("/", middlewares.Auth(), middlewares.Admin(), utils.WP(usrCtrl.GetUsers))
	usr.GET("/@me", middlewares.Auth(), utils.WP(usrCtrl.GetMe))
	usr.GET("/:id", middlewares.Auth(), middlewares.Admin(), utils.WP(usrCtrl.GetUserById))
	usr.POST("/", utils.WP(usrCtrl.CreateUser))
	usr.PATCH("/:id", middlewares.Auth(), utils.WP(usrCtrl.UpdateUser))
	usr.PATCH("/:id/password", middlewares.Auth(), utils.WP(usrCtrl.UpdatePassword))
}
