package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/utils"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

type UploadController interface {
	UploadAvatar(c *gin.Context)
	UploadFile(c *gin.Context)
}

func NewUploadController(app *app.App) UploadController {
	return &Controller{
		app: app,
	}
}

func (ctr *Controller) UploadAvatar(c *gin.Context) {
	file, header, err := c.Request.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Failed to get file"))
		return
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)

	// Check if the file size exceeds the limit
	if header.Size > int64(ctr.app.Config.Cdn.MaxSize) {
		c.JSON(http.StatusBadRequest, utils.Error("File size exceeds the limit"))
		return
	}

	// Check if the MIME type is supported
	mimeType := header.Header.Get("Content-Type")
	isSupportedMime := false
	for _, supportedMime := range ctr.app.Config.Cdn.SupportedTypesImages {
		if mimeType == supportedMime {
			isSupportedMime = true
			break
		}
	}
	if !isSupportedMime {
		c.JSON(http.StatusBadRequest, utils.Error("File type not supported"))
		return
	}

	userID, _ := c.Get("user_id")
	prefix := fmt.Sprintf("avatars/%0.f", userID)

	// Lister les fichiers de l'utilisateur dans MinIO
	objectsCh := ctr.app.MinioClient.ListObjects(c, os.Getenv("MINIO_BUCKET"), minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	// Supprimer les anciens avatars
	for object := range objectsCh {
		if object.Err == nil {
			_ = ctr.app.MinioClient.RemoveObject(c, os.Getenv("MINIO_BUCKET"), object.Key, minio.RemoveObjectOptions{})
		}
	}

	objectName := fmt.Sprintf("avatars/%0.f%s", userID, ext)

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error("Failed to upload file"))
		return
	}

	c.JSON(http.StatusOK, utils.Success("Avatar uploaded successfully"))
}

func (ctr *Controller) UploadFile(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Failed to get file"))
		return
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)

	// Check if the file size exceeds the limit
	if header.Size > int64(ctr.app.Config.Cdn.MaxUploadsSize) {
		c.JSON(http.StatusBadRequest, utils.Error("File size exceeds the limit"))
		return
	}

	// Check if the MIME type is supported
	mimeType := header.Header.Get("Content-Type")
	isSupportedMime := false
	for _, supportedMime := range ctr.app.Config.Cdn.SupportedTypes {
		if mimeType == supportedMime {
			isSupportedMime = true
			break
		}
	}
	if !isSupportedMime {
		c.JSON(http.StatusBadRequest, utils.Error("File type not supported"))
		return
	}

	userID, _ := c.Get("user_id")

	objectName := fmt.Sprintf("uploads/%0.f%s", userID, ext)

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error("Failed to upload file"))
		return
	}

	c.JSON(http.StatusOK, utils.Success("File uploaded successfully"))
}
