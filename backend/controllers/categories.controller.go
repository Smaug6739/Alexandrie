package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CategoriesController interface {
	GetCategories(c *gin.Context) (int, any)
	CreateCategory(c *gin.Context) (int, any)
	UpdateCategory(c *gin.Context) (int, any)
	DeleteCategory(c *gin.Context) (int, any)
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

// Create category
// @Summary Create a new category
// @Method POST
// @Router /categories [post]
// @Security Authenfification: Auth
// @Param category body models.Category true "Category"
// @Success 201 {object} Success(models.Category)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) CreateCategory(c *gin.Context) (int, any) {
	var category models.Category
	if err := c.ShouldBind(&category); err != nil {
		return http.StatusBadRequest, errors.New("invalid request payload")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	category = models.Category{
		Id:          ctr.app.Snowflake.Generate(),
		Name:        category.Name,
		Icon:        category.Icon,
		Order:       category.Order,
		Role:        category.Role,
		WorkspaceId: category.WorkspaceId,
		ParentId:    category.ParentId,
		AuthorId:    userId,
	}

	if err := ctr.app.Services.Category.CreateCategory(&category); err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusCreated, category
}

// Update category
// @Summary Update a category
// @Method PUT
// @Router /categories/{id} [put]
// @Security Authenfification: Auth
// @Param id path string true "Category ID"
// @Param category body models.Category true "Category"
// @Success 200 {object} Success(models.Category)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdateCategory(c *gin.Context) (int, any) {
	categoryid, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	dbCategory, err := ctr.app.Services.Category.GetCategory(categoryid)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = utils.RessourceAccess(c, dbCategory.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	category := &models.Category{}
	if err := c.ShouldBind(category); err != nil {
		return http.StatusBadRequest, err
	}
	category = &models.Category{
		Id:          categoryid,
		Name:        category.Name,
		Icon:        category.Icon,
		Order:       category.Order,
		Role:        category.Role,
		WorkspaceId: category.WorkspaceId,
		ParentId:    category.ParentId,
		AuthorId:    dbCategory.AuthorId,
	}

	err = ctr.app.Services.Category.UpdateCategory(category)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, category
}

// Delete category
// @Summary Delete a category
// @Method DELETE
// @Router /categories/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "Category ID"
// @Success 204 {object} Success
// @Failure 400 {object} Error
// @Failure 401 {object} Error

// Delete document
// @Summary Delete document
// @Method DELETE
// @Router /documents/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "Document ID"
// @Success 200 {object} Success(models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeleteCategory(c *gin.Context) (int, any) {
	categoryId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	db_category, err := ctr.app.Services.Category.GetCategory(categoryId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = utils.RessourceAccess(c, db_category.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Category.DeleteCategory(categoryId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, db_category
}
