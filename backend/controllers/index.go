package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
)

type Controller struct {
	app   *app.App
	model *models.Model
}

func NewController(app *app.App) *Controller {
	return &Controller{
		app:   app,
		model: models.NewModel(app.DB),
	}
}
