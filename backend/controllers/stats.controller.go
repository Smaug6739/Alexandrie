package controllers

import (
	"alexandrie/app"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type StatsController interface {
	GetOverviewStats(c *gin.Context) (int, any)
	GetUserStats(c *gin.Context) (int, any)
	GetNodeStats(c *gin.Context) (int, any)
}

func NewStatsController(app *app.App) StatsController {
	return &Controller{app: app}
}

func (ctr *Controller) GetOverviewStats(c *gin.Context) (int, any) {
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	stats, err := ctr.app.Services.Stats.GetOverviewStats()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, stats
}

func (ctr *Controller) GetUserStats(c *gin.Context) (int, any) {
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	stats, err := ctr.app.Services.Stats.GetUserStats()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, stats
}

func (ctr *Controller) GetNodeStats(c *gin.Context) (int, any) {
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	topLimit := 5
	if top := c.Query("top"); top != "" {
		parsed, err := strconv.Atoi(top)
		if err != nil {
			return http.StatusBadRequest, err
		}
		if parsed <= 0 {
			return http.StatusBadRequest, errors.New("top must be a positive integer")
		}
		if parsed > 50 {
			parsed = 50
		}
		topLimit = parsed
	}

	stats, err := ctr.app.Services.Stats.GetNodeStats(topLimit)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, stats
}
