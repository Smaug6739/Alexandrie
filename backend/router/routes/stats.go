package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Stats(app *app.App, router *gin.RouterGroup) {
	stats := router.Group("/stats")
	statsCtrl := controllers.NewStatsController(app)

	stats.GET("/overview", middlewares.Auth(), middlewares.Admin(), utils.WP(statsCtrl.GetOverviewStats))
	stats.GET("/users", middlewares.Auth(), middlewares.Admin(), utils.WP(statsCtrl.GetUserStats))
	stats.GET("/nodes", middlewares.Auth(), middlewares.Admin(), utils.WP(statsCtrl.GetNodeStats))
}
