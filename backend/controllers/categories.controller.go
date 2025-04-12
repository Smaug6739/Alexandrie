package controllers

import (
	"alexandrie/app"
	"alexandrie/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CategoriesController interface {
	GetCategories(c *gin.Context) (int, any)
}

func NewCategoriesController(app *app.App) CategoriesController {
	return &Controller{
		app: app,
	}
}

// Get categories
// @Summary Get all categories
// @Method GET
// @Router /categories [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Category)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetCategories(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR, "userId")
	if err != nil {
		return http.StatusUnauthorized, err
	}
	categories, err := ctr.app.Services.Category.GetAllCategories(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, categories
}
