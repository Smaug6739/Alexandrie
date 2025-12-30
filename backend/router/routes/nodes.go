package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Nodes(app *app.App, router *gin.RouterGroup) {
	node := router.Group("/nodes")
	nodeCtrl := controllers.NewNodeController(app)
	permCtrl := controllers.NewPermissionsController(app)

	node.GET("/public/:nodeId", utils.WP(nodeCtrl.GetPublicNode))
	node.GET("/search", middlewares.Auth(), utils.WP(nodeCtrl.SearchNodes))
	node.GET("/shared/:userId", middlewares.Auth(), utils.WP(nodeCtrl.GetSharedNodes))
	node.GET("/:nodeId", middlewares.Auth(), utils.WP(nodeCtrl.GetNode))
	node.GET("/:nodeId/permissions", middlewares.Auth(), utils.WP(permCtrl.GetNodePermissions))
	node.GET("/user/:userId", middlewares.Auth(), utils.WP(nodeCtrl.GetNodes))

	node.POST("", middlewares.Auth(), utils.WP(nodeCtrl.CreateNode))
	node.POST("/:nodeId/permissions", middlewares.Auth(), utils.WP(permCtrl.CreatePermission))

	node.PUT("/:nodeId", middlewares.Auth(), utils.WP(nodeCtrl.UpdateNode))

	node.PATCH("/:nodeId/permissions/:permId", middlewares.Auth(), utils.WP(permCtrl.UpdatePermission))

	node.DELETE("/:nodeId/permissions/:permId", middlewares.Auth(), utils.WP(permCtrl.DeletePermission))
	node.DELETE("/:nodeId", middlewares.Auth(), utils.WP(nodeCtrl.DeleteNode))

}
