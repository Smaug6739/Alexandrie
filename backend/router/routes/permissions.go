package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Permissions(app *app.App, router *gin.RouterGroup) {
	usr := router.Group("/permissions")
	permissionsCtrl := controllers.NewPermissionsController(app)

	usr.GET("/:nodeId", middlewares.Auth(), utils.WP(permissionsCtrl.GetNodePermissions))
	usr.POST("", middlewares.Auth(), utils.WP(permissionsCtrl.CreatePermission))
	usr.PATCH("/:id", middlewares.Auth(), utils.WP(permissionsCtrl.UpdatePermission))
	usr.DELETE("/:id", middlewares.Auth(), utils.WP(permissionsCtrl.DeletePermission))
}
