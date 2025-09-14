package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Nodes(app *app.App, router *gin.RouterGroup) {
	doc := router.Group("/nodes")
	docCtrl := controllers.NewNodeController(app)

	doc.GET("/public/:id", middlewares.Auth(), utils.WP(docCtrl.GetPublicNode))
	doc.GET("/:userId", middlewares.Auth(), utils.WP(docCtrl.GetNodes))
	doc.GET("/:userId/:id", middlewares.Auth(), utils.WP(docCtrl.GetNode))
	doc.POST("", middlewares.Auth(), utils.WP(docCtrl.CreateNode))
	doc.PUT("/:id", middlewares.Auth(), utils.WP(docCtrl.UpdateNode))
	doc.DELETE("/:id", middlewares.Auth(), utils.WP(docCtrl.DeleteNode))
}
