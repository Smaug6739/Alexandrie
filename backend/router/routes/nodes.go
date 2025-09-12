package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Nodes(app *app.App, router *gin.RouterGroup) {
	nodes := router.Group("/nodes")
	nodesCtrl := controllers.NewNodesController(app)

	nodes.GET("/:userId/:id", middlewares.Auth(), utils.WP(nodesCtrl.GetNodes))
}
