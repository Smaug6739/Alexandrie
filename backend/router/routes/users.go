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
	usr.GET("/:id", middlewares.Auth(), utils.WP(usrCtrl.GetUserById))
	usr.POST("/", utils.WP(usrCtrl.CreateUser))
	usr.PATCH("/:id", middlewares.Auth(), utils.WP(usrCtrl.UpdateUser))
	usr.PATCH("/:id/password", middlewares.Auth(), utils.WP(usrCtrl.UpdatePassword))
	usr.DELETE("/:id", middlewares.Auth(), utils.WP(usrCtrl.DeleteUser))
}
