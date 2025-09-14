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

	node.GET("/public/:id", middlewares.Auth(), utils.WP(nodeCtrl.GetPublicNode))
	node.GET("/shared/:userId", middlewares.Auth(), utils.WP(nodeCtrl.GetSharedNodes))
	node.GET("/:userId", middlewares.Auth(), utils.WP(nodeCtrl.GetNodes))
	node.GET("/:userId/:id", middlewares.Auth(), utils.WP(nodeCtrl.GetNode))
	node.POST("", middlewares.Auth(), utils.WP(nodeCtrl.CreateNode))
	node.PUT("/:id", middlewares.Auth(), utils.WP(nodeCtrl.UpdateNode))
	node.DELETE("/:id", middlewares.Auth(), utils.WP(nodeCtrl.DeleteNode))
}
