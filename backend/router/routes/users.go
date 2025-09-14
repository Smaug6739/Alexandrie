package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Users(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/users")
	usrCtrl := controllers.NewUserController(app)

	usr.GET("", middlewares.Auth(), middlewares.Admin(), utils.WP(usrCtrl.GetUsers))
	usr.GET("/:userId", middlewares.Auth(), utils.WP(usrCtrl.GetUserById))
	usr.POST("", utils.WP(usrCtrl.CreateUser))
	usr.PATCH("/:userId", middlewares.Auth(), utils.WP(usrCtrl.UpdateUser))
	usr.PATCH("/:userId/password", middlewares.Auth(), utils.WP(usrCtrl.UpdatePassword))
	usr.DELETE("/:userId", middlewares.Auth(), utils.WP(usrCtrl.DeleteUser))
}
