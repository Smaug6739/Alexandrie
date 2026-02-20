package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func UserSettings(app *app.App, router *gin.RouterGroup) {
	grp := router.Group("/user/settings")
	ctrl := controllers.NewUserSettingsController(app)

	grp.GET("", middlewares.Auth(), utils.WP(ctrl.GetSettings))
	grp.PUT("", middlewares.Auth(), utils.WP(ctrl.SaveSettings))
}
