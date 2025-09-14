package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/types"
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
	GetBackup(c *gin.Context) (int, any)
	UploadFile(c *gin.Context) (int, any)
	UploadAvatar(c *gin.Context) (int, any)
	DeleteUpload(c *gin.Context) (int, any)
}

func NewRessourceController(app *app.App) RessourceController {
	return &Controller{
		app: app,
	}
}

// Get backup
// @Summary Get backups files of database (documents, categories, nodes)
// @Summary Save database as json file and save it in minio (/userid/backups)
// @Method GET
// @Router /uploads/backup [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetBackup(c *gin.Context) (int, any) {
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("minio client not initialized")
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	nodes_list, err := ctr.app.Services.Nodes.GetAllNodeBackup(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	backup := map[string]interface{}{
		"nodes": nodes_list,
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
// @Success 200 {object} Success(node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UploadFile(c *gin.Context) (int, any) {
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("minio client not initialized")
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
	totalSize, err := ctr.app.Services.Nodes.GetUserUploadsSize(userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if totalSize+header.Size > int64(ctr.app.Config.Cdn.MaxUploadsSize) {
		return http.StatusBadRequest, errors.New("total size of uploads exceeds the limit")
	}
	id := ctr.app.Snowflake.Generate()
	transformedPath := fmt.Sprintf("%d%s", id, ext)
	metadata := types.JSONB{
		"filetype":         mimeType,
		"original_path":    header.Filename,
		"transformed_path": transformedPath,
	}
	// Create a new node
	node := &models.Node{
		Id:               id,
		UserId:           userId,
		ParentId:         nil,
		Name:             fmt.Sprintf("%.*s", 50, header.Filename),
		Role:             4, // Ressource role is always 4
		Size:             &header.Size,
		Content:          &header.Filename,
		ContentCompiled:  &transformedPath,
		Metadata:         &metadata,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	objectName := fmt.Sprintf("%d/%d%s", node.UserId, node.Id, ext)

	err = ctr.app.Services.Nodes.CreateNode(node)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to create node")
	}

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, node
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
		return http.StatusInternalServerError, errors.New("minio client not initialized")
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
		return http.StatusInternalServerError, errors.New("minio client not initialized")
	}
	id, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, errors.New("invalid id format")
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(id)
	if err != nil {
		return http.StatusInternalServerError, "failed to get node"
	}
	if node == nil {
		return http.StatusBadRequest, errors.New("node not found")
	}
	if node.UserId != userId && !utils.CheckUserRequestPermission(c, utils.ADMINISTRATOR) {
		return http.StatusUnauthorized, errors.New("you are not authorized to delete this node")
	}

	prefix := fmt.Sprintf("%d/%d", node.UserId, node.Id)
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
	err = ctr.app.Services.Nodes.DeleteNode(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "File deleted successfully"
}
