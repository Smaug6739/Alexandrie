package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Categories(app *app.App, router *gin.RouterGroup) {
	doc := router.Group("/categories")
	docCtrl := controllers.NewCategoriesController(app)

	doc.GET("/:userId", middlewares.Auth(), utils.WP(docCtrl.GetCategories))
}
