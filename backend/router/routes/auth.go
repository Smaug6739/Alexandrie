package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Auth(app *app.App, router *gin.RouterGroup) {
	auth := router.Group("/auth")

	authCtrl := controllers.NewAuthController(app)
	auth.POST("", utils.WP(authCtrl.Login))
	auth.POST("/refresh", utils.WP(authCtrl.RefreshSession))
	auth.POST("/request-reset", utils.WP(authCtrl.RequestResetPassword))
	auth.POST("/reset-password", utils.WP(authCtrl.ResetPassword))
	auth.POST("/logout", utils.WP(authCtrl.Logout))
	auth.POST("/logout/all", middlewares.Auth(), utils.WP(authCtrl.LogoutAllDevices))
}
