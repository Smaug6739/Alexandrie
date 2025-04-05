package controllers

import (
	"Smaug6739/Alexandrie/app"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

type UploadController interface {
	UploadAvatar(c *gin.Context) (int, any)
	UploadFile(c *gin.Context) (int, any)
}
type UploadControllerImpl struct {
	Controller
}

func NewUploadController(app *app.App) UploadController {
	return &UploadControllerImpl{
		Controller: Controller{
			app: app,
		},
	}
}

func (ctr *Controller) UploadAvatar(c *gin.Context) (int, any) {
	file, header, err := c.Request.FormFile("avatar")
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
	isSupportedMime := false
	for _, supportedMime := range ctr.app.Config.Cdn.SupportedTypesImages {
		if mimeType == supportedMime {
			isSupportedMime = true
			break
		}
	}
	if !isSupportedMime {
		return http.StatusBadRequest, errors.New("file type not supported")
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
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, "Avatar uploaded successfully"
}

func (ctr *Controller) UploadFile(c *gin.Context) (int, any) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)

	// Check if the file size exceeds the limit
	if header.Size > int64(ctr.app.Config.Cdn.MaxUploadsSize) {
		return http.StatusBadRequest, errors.New("file size exceeds the limit")
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
		return http.StatusBadRequest, errors.New("file type not supported")
	}

	userID, _ := c.Get("user_id")

	objectName := fmt.Sprintf("uploads/%0.f%s", userID, ext)

	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload file")
	}

	return http.StatusOK, "File uploaded successfully"
}
