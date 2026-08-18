package routes

import (
	"alexandrie/app"
	"alexandrie/controllers"
	"alexandrie/middlewares"
	"alexandrie/utils"
	"github.com/gin-gonic/gin"
)

func CalendarEvents(app *app.App, router *gin.RouterGroup) {
	group := router.Group("/calendar")
	ctrl := controllers.NewCalendarEventController(app)




	
	group.GET("", middlewares.Auth(), utils.WP(ctrl.GetEvents))
	group.POST("", middlewares.Auth(), utils.WP(ctrl.CreateEvent))
	group.PUT("/:eventId", middlewares.Auth(), utils.WP(ctrl.UpdateEvent))
	group.DELETE("/:eventId", middlewares.Auth(), utils.WP(ctrl.DeleteEvent))
}
