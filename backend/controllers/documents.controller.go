package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type DocumentController interface {
	GetDocuments(c *gin.Context) (int, any)
	GetDocument(c *gin.Context) (int, any)
	CreateDocument(c *gin.Context) (int, any)
	UpdateDocument(c *gin.Context) (int, any)
	DeleteDocument(c *gin.Context) (int, any)
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

// Get document by id
// @Summary Get document by id
// @Method GET
// @Router /documents/{id} [get]
// @Security Authenfification: Auth
// @Param id path string true "Document ID"
// @Success 200 {object} Success(models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetDocument(c *gin.Context) (int, any) {
	documentId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	document, err := ctr.app.Services.Document.GetDocument(documentId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = utils.RessourceAccess(c, document.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, document
}

// Create document
// @Summary Create document
// @Method POST
// @Router /documents [post]
// @Security Authenfification: Auth
// @Body document body models.Document true "Document"
// @Success 200 {object} Success(models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) CreateDocument(c *gin.Context) (int, any) {
	document := &models.Document{}
	if err := c.ShouldBind(document); err != nil {
		return http.StatusBadRequest, err
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	document = &models.Document{
		Id:               ctr.app.Snowflake.Generate(),
		Name:             document.Name,
		Description:      document.Description,
		Tags:             document.Tags,
		Category:         document.Category,
		ParentId:         document.ParentId,
		Accessibility:    document.Accessibility,
		ContentMarkdown:  document.ContentMarkdown,
		ContentHtml:      document.ContentHtml,
		AuthorId:         userId,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}
	fmt.Println("Document", document)

	err = ctr.app.Services.Document.CreateDocument(document)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, document
}

// Update document
// @Summary Update document
// @Method PUT
// @Router /documents/{id} [put]
// @Security Authenfification: Auth
// @Param id path string true "Document ID"
// @Body document body models.Document true "Document"
// @Success 200 {object} Success(models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdateDocument(c *gin.Context) (int, any) {
	documentId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	db_document, err := ctr.app.Services.Document.GetDocument(documentId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = utils.RessourceAccess(c, db_document.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	document := &models.Document{}
	if err := c.ShouldBind(document); err != nil {
		return http.StatusBadRequest, err
	}
	document = &models.Document{
		Id:               documentId,
		Name:             document.Name,
		Description:      document.Description,
		Tags:             document.Tags,
		Category:         document.Category,
		ParentId:         document.ParentId,
		Accessibility:    document.Accessibility,
		ContentMarkdown:  document.ContentMarkdown,
		ContentHtml:      document.ContentHtml,
		AuthorId:         db_document.AuthorId,
		CreatedTimestamp: time.Now().UnixMilli(),
	}

	err = ctr.app.Services.Document.UpdateDocument(document)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, document
}

// Delete document
// @Summary Delete document
// @Method DELETE
// @Router /documents/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "Document ID"
// @Success 200 {object} Success(models.Document)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeleteDocument(c *gin.Context) (int, any) {
	documentId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	db_document, err := ctr.app.Services.Document.GetDocument(documentId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = utils.RessourceAccess(c, db_document.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Document.DeleteDocument(documentId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, db_document
}
