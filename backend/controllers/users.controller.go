package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	app        *app.App
	user_model *models.Model
}

func NewUserController(app *app.App) *UserController {
	return &UserController{
		app:        app,
		user_model: models.NewModel(app.DB),
	}
}

func (ctr *UserController) GetUsers(c *gin.Context) {

	users, err := ctr.user_model.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
