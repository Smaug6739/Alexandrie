package controllers

import (
	"alexandrie/app"
	"alexandrie/permissions"
	"alexandrie/types"
	"alexandrie/utils"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResourceController interface {
	UploadFile(c *gin.Context) (int, any)
	UploadAvatar(c *gin.Context) (int, any)
}

func NewResourceController(app *app.App) ResourceController {
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
	}
}

// UploadFile handles file upload and stores it in the CDN
// @Method POST
// @Description Upload a file to the CDN.
// @Router /resources/upload [post]
func (ctr *Controller) UploadFile(c *gin.Context) (int, any) {

	// Limit request body size
	c.Request.Body = http.MaxBytesReader(
		c.Writer,
		c.Request.Body,
		int64(ctr.app.Config.Cdn.MaxSize),
	)
	file, header, err := c.Request.FormFile("file")
	parentIdStr := c.Request.FormValue("parent_id")

	var parentId *types.Snowflake = nil
	if parentIdStr != "" {
		parentId, err = types.SnowflakeFromString(parentIdStr)
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
	node, err := ctr.app.Services.Resource.UploadFile(
		header.Filename,
		header.Size,
		fileContent,
		mimeType,
		userId,
		parentId,
		ctr.app.Config.Cdn.MaxUploadsSize,
		ctr.app.Config.Cdn.SupportedTypes,
		ctr.app.MinioClient,
	)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, node
}

// UploadAvatar handles avatar upload and stores it in the CDN
// @Method POST
// @Description Upload a user avatar to the CDN.
// @Router /resources/avatar [post]
func (ctr *Controller) UploadAvatar(c *gin.Context) (int, any) {

	// Limit request body size
	c.Request.Body = http.MaxBytesReader(
		c.Writer,
		c.Request.Body,
		int64(ctr.app.Config.Cdn.MaxSize),
	)
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("file too large or failed to get file")
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
	err = ctr.app.Services.Resource.UploadAvatar(
		header.Filename,
		header.Size,
		fileContent,
		mimeType,
		userId,
		ctr.app.Config.Cdn.SupportedTypesImages,
		ctr.app.MinioClient,
	)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "Avatar uploaded successfully"
}
