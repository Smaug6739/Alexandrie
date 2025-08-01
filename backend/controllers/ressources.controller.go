package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"slices"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

type RessourceController interface {
	GetAllUploads(c *gin.Context) (int, any)
	GetBackup(c *gin.Context) (int, any)
	UploadFile(c *gin.Context) (int, any)
	UploadAvatar(c *gin.Context) (int, any)
	UpdateUpload(c *gin.Context) (int, any)
	DeleteUpload(c *gin.Context) (int, any)
}

func NewRessourceController(app *app.App) RessourceController {
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

// Get backup
// @Summary Get backups files of database (documents, categories, ressources)
// @Summary Save database as json file and save it in minio (/userid/backups)
// @Method GET
// @Router /uploads/backup [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetBackup(c *gin.Context) (int, any) {
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("Minio client not initialized")
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Create the backup file from database data
	documents_list, err := ctr.app.Services.Document.GetAllDocumentBackup(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	categories_list, err := ctr.app.Services.Category.GetAllCategories(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	ressources_list, err := ctr.app.Services.Ressource.GetAllUploadsByUserId(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	backup := map[string]interface{}{
		"documents":  documents_list,
		"categories": categories_list,
		"ressources": ressources_list,
	}
	jsonString, err := json.Marshal(backup)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	objectName := fmt.Sprintf("%d/backups/backup.json", userId)
	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(jsonString), int64(len(jsonString)), minio.PutObjectOptions{ContentType: "application/json"})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusCreated, gin.H{
		"link": objectName,
	}
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
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("Minio client not initialized")
	}
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
	id := ctr.app.Snowflake.Generate()
	ressource := &models.Ressource{
		Id:               id,
		Filename:         fmt.Sprintf("%.*s", 40, header.Filename),
		Filesize:         header.Size,
		Filetype:         mimeType,
		OriginalPath:     header.Filename,
		TransformedPath:  fmt.Sprintf("%d%s", id, ext),
		ParentId:         nil,
		AuthorId:         userId,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	objectName := fmt.Sprintf("%d/%d%s", ressource.AuthorId, ressource.Id, ext)

	_, err = ctr.app.Services.Ressource.CreateRessource(ressource)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to create ressource")
	}

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, ressource
}

// Upload avatar
// @Summary Upload an avatar (not saved in DB and name is "avatar")
// @Method POST
// @Router /uploads/avatar [post]
// @Security Authenfification: Auth
// @Param file formData file true "File to upload"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UploadAvatar(c *gin.Context) (int, any) {
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("Minio client not initialized")
	}
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

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

	objectName := fmt.Sprintf("%d/%s", userId, "avatar")

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, "File uploaded successfully"
}

// UpdateUpload
// @Summary Update an upload (only metadata)
// @Method PUT
// @Router /uploads/{id} [put]
// @Security Authenfification: Auth
// @Param id path string true "ID of the upload to update"
// @Param upload body models.Ressource true "Upload data"
// @Success 200 {object} Success(models.Ressource)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdateUpload(c *gin.Context) (int, any) {
	id, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, errors.New("invalid id format")
	}
	db_ressource, err := ctr.app.Services.Ressource.GetRessourceById(id)
	if err != nil {
		return http.StatusInternalServerError, "failed to get ressource"
	}
	if db_ressource == nil {
		return http.StatusBadRequest, errors.New("ressource not found")
	}
	err = utils.RessourceAccess(c, db_ressource.AuthorId)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	var updatedRessource *models.Ressource
	if err := c.ShouldBindJSON(&updatedRessource); err != nil {
		return http.StatusBadRequest, errors.New("failed to bind JSON")
	}
	updatedRessource = &models.Ressource{
		Id:               db_ressource.Id,
		Filename:         updatedRessource.Filename,
		Filesize:         db_ressource.Filesize,
		Filetype:         db_ressource.Filetype,
		OriginalPath:     db_ressource.OriginalPath,
		TransformedPath:  db_ressource.TransformedPath,
		ParentId:         updatedRessource.ParentId,
		AuthorId:         db_ressource.AuthorId,
		CreatedTimestamp: db_ressource.CreatedTimestamp,
	}

	_, err = ctr.app.Services.Ressource.UpdateRessource(updatedRessource)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to update ressource")
	}

	return http.StatusOK, updatedRessource
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
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("Minio client not initialized")
	}
	id, err := utils.GetIdParam(c, c.Param("id"))
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

	prefix := fmt.Sprintf("%d/%d", ressource.AuthorId, ressource.Id)
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
