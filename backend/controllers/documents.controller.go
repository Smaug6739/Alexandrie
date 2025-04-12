package controllers

import (
	"alexandrie/app"
	"alexandrie/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DocumentController interface {
	GetDocuments(c *gin.Context) (int, any)
}

func NewDocumentController(app *app.App) DocumentController {
	return &Controller{
		app: app,
	}
}

// Get documents
// @Summary Get all documents
// @Method GET
// @Router /documents [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetDocuments(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR, "userId")
	if err != nil {
		return http.StatusUnauthorized, err
	}
	documents, err := ctr.app.Services.Document.GetAllDocuments(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, documents
}
