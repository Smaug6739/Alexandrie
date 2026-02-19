package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/types"
	"alexandrie/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserSettingsController interface {
	GetSettings(c *gin.Context) (int, any)
	SaveSettings(c *gin.Context) (int, any)
}

func NewUserSettingsController(app *app.App) UserSettingsController {
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
	}
}

// GetSettings returns the user's preferences
// @Summary Get current user settings
// @Method GET
// @Router /user/settings [get]
// @Security Auth
// @Success 200 {object} Success(models.UserSettings)
func (ctr *Controller) GetSettings(c *gin.Context) (int, any) {
	userID, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	settings, err := ctr.app.Services.UserSettings.GetSettings(userID)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, settings
}

// SaveSettings saves the user's preferences (upsert)
// @Summary Save current user settings
// @Method PUT
// @Router /user/settings [put]
// @Security Auth
// @Success 200 {object} Success(models.UserSettings)
func (ctr *Controller) SaveSettings(c *gin.Context) (int, any) {
	userID, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	var body struct {
		General  types.JSONB `json:"general"`
		Editor   types.JSONB `json:"editor"`
		Advanced types.JSONB `json:"advanced"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		return http.StatusBadRequest, err
	}

	settings := &models.UserSettings{
		UserID:   userID,
		General:  body.General,
		Editor:   body.Editor,
		Advanced: body.Advanced,
	}

	if err := ctr.app.Services.UserSettings.SaveSettings(settings); err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, settings
}
