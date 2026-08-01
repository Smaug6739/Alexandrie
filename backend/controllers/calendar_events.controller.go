package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"net/http"
	"github.com/gin-gonic/gin"
)

type CalendarEventController interface {
	GetEvents(c *gin.Context) (int, any)
	CreateEvent(c *gin.Context) (int, any)
	UpdateEvent(c *gin.Context) (int, any)
	DeleteEvent(c *gin.Context) (int, any)
}

func NewCalendarEventController(app *app.App) CalendarEventController {
	return &Controller{app: app}
}

func (ctr *Controller) GetEvents(c *gin.Context) (int, any) {
	actor, err := actorFromRequest(c)
	if err != nil {
		return statusFromAccessError(err), err
	}
	events, err := ctr.app.Services.CalendarEvent.GetEvents(actor.UserID)
	if err != nil {
		return http.StatusInternalServerError, err
	}
 return http.StatusOK, events
}

func (ctr *Controller) CreateEvent(c *gin.Context) (int, any) {
	actor, err := actorFromRequest(c)
	if err != nil {
		return statusFromAccessError(err), err
	}
	var event models.CalendarEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		return http.StatusBadRequest, err
	}
	created, err := ctr.app.Services.CalendarEvent.CreateEvent(actor.UserID, &event)
	if err != nil {
		return http.StatusInternalServerError, err
	}	return http.StatusCreated, created
}

func (ctr *Controller) UpdateEvent(c *gin.Context) (int, any) {
	actor, err := actorFromRequest(c)
	if err != nil {
		return statusFromAccessError(err), err
	}

	eventId, err := utils.GetTargetId(c, c.Param("eventId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	var event models.CalendarEvent
	if err := c.ShouldBindJSON(&event); err != nil {
		return http.StatusBadRequest, err
	}
	event.Id = eventId

	updated, err := ctr.app.Services.CalendarEvent.UpdateEvent(actor.UserID, &event)
	if err != nil {
		return http.StatusInternalServerError, err
	}	return http.StatusOK, updated
}

func (ctr *Controller) DeleteEvent(c *gin.Context) (int, any) {
	actor, err := actorFromRequest(c)
	if err != nil {
		return statusFromAccessError(err), err
	}

	eventId, err := utils.GetTargetId(c, c.Param("eventId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	err = ctr.app.Services.CalendarEvent.DeleteEvent(eventId, actor.UserID)
	if err != nil {
		return http.StatusInternalServerError, err
	}
return http.StatusOK, map[string]string{"message": "event deleted successfully"}
}
