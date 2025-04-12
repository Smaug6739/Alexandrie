package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"slices"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

type UploadController interface {
	GetAllUploads(c *gin.Context) (int, any)
	UploadFile(c *gin.Context) (int, any)
	DeleteUpload(c *gin.Context) (int, any)
}

func NewUploadController(app *app.App) UploadController {
	return &Controller{
		app: app,
	}
}

func (ctr *Controller) GetAllUploads(c *gin.Context) (int, any) {
	userId, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR, "userId")
	if err != nil {
		return http.StatusUnauthorized, err
	}
	uploads, err := ctr.app.Services.Ressource.GetAllUploadsByUserId(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, uploads
}

// UploadFile
// @Summary Upload a file
// @Method POST
// @Router /uploads/ [post]
// @Security Authenfification: Auth
// @Param file formData file true "File to upload"
// @Success 200 {object} Success(ressource)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UploadFile(c *gin.Context) (int, any) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)

	// Check if the file size exceeds the limit
	if header.Size > int64(ctr.app.Config.Cdn.MaxSize) {
		return http.StatusBadRequest, errors.New("file size exceeds the limit")
	}

	// Check if the MIME type is supported
	mimeType := header.Header.Get("Content-Type")
	isSupportedMime := slices.Contains(ctr.app.Config.Cdn.SupportedTypes, mimeType)
	if !isSupportedMime {
		return http.StatusBadRequest, errors.New("file type not supported")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Check total size of uploads
	totalSize, err := ctr.app.Services.Ressource.GetUserUploadsSize(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if totalSize+header.Size > int64(ctr.app.Config.Cdn.MaxUploadsSize) {
		return http.StatusBadRequest, errors.New("total size of uploads exceeds the limit")
	}

	// Create a new ressource
	ressource := &models.Ressource{
		Id:               ctr.app.Snowflake.Generate(),
		Filename:         fmt.Sprintf("%.*s", 40, header.Filename),
		Filesize:         header.Size,
		Filetype:         mimeType,
		OriginalPath:     header.Filename,
		TransformedPath:  "uploads/" + header.Filename,
		AuthorId:         userId,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	objectName := fmt.Sprintf("uploads/%d/%d%s", ressource.AuthorId, ressource.Id, ext)

	_, err = ctr.app.Services.Ressource.CreateRessource(ressource)
	if err != nil {
		fmt.Println(err)
		return http.StatusInternalServerError, errors.New("failed to create ressource")
	}

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, ressource
}

// DeleteUpload
// @Summary Delete an upload
// @Method DELETE
// @Router /uploads/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "ID of the upload to delete"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeleteUpload(c *gin.Context) (int, any) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return http.StatusBadRequest, errors.New("invalid id format")
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	ressource, err := ctr.app.Services.Ressource.GetRessourceById(id)
	if err != nil {
		return http.StatusInternalServerError, "failed to get ressource"
	}
	if ressource == nil {
		return http.StatusBadRequest, errors.New("ressource not found")
	}
	if ressource.AuthorId != userId && !utils.CheckUserRequestPermission(c, utils.ADMINISTRATOR) {
		return http.StatusUnauthorized, errors.New("you are not authorized to delete this ressource")
	}

	prefix := fmt.Sprintf("uploads/%d/%d", ressource.AuthorId, ressource.Id)
	// List all objects in the bucket with the given prefix
	ctx := context.Background()
	objectCh := ctr.app.MinioClient.ListObjects(ctx, os.Getenv("MINIO_BUCKET"), minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	// Delete each object
	for object := range objectCh {
		if object.Err != nil {
			return http.StatusInternalServerError, object.Err
		}
		err = ctr.app.MinioClient.RemoveObject(ctx, os.Getenv("MINIO_BUCKET"), object.Key, minio.RemoveObjectOptions{})
		if err != nil {
			return http.StatusInternalServerError, fmt.Errorf("failed to delete object: %v", err)
		}
	}
	err = ctr.app.Services.Ressource.DeleteRessource(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "File deleted successfully"
}
