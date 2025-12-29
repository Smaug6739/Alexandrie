package controllers

import (
	"alexandrie/app"
	"alexandrie/permissions"
	"alexandrie/utils"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RessourceController interface {
	GetBackup(c *gin.Context) (int, any)
	UploadFile(c *gin.Context) (int, any)
	UploadAvatar(c *gin.Context) (int, any)
}

func NewRessourceController(app *app.App) RessourceController {
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
	}
}

func (ctr *Controller) GetBackup(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	link, err := ctr.app.Services.Ressource.CreateBackup(userId, ctr.app.MinioClient)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusCreated, gin.H{"link": link}
}

func (ctr *Controller) UploadFile(c *gin.Context) (int, any) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

	fileContent, err := io.ReadAll(file)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to read file")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	mimeType := header.Header.Get("Content-Type")
	node, err := ctr.app.Services.Ressource.UploadFile(
		header.Filename,
		header.Size,
		fileContent,
		mimeType,
		userId,
		ctr.app.Config.Cdn.MaxSize,
		ctr.app.Config.Cdn.MaxUploadsSize,
		ctr.app.Config.Cdn.SupportedTypes,
		ctr.app.MinioClient,
	)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, node
}

func (ctr *Controller) UploadAvatar(c *gin.Context) (int, any) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

	fileContent, err := io.ReadAll(file)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to read file")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	mimeType := header.Header.Get("Content-Type")
	err = ctr.app.Services.Ressource.UploadAvatar(
		header.Filename,
		header.Size,
		fileContent,
		mimeType,
		userId,
		ctr.app.Config.Cdn.MaxSize,
		ctr.app.Config.Cdn.SupportedTypesImages,
		ctr.app.MinioClient,
	)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "Avatar uploaded successfully"
}
