package controllers

import (
	"alexandrie/app"
	"alexandrie/permissions"
	"alexandrie/utils"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

func (ctr *Controller) UploadFont(c *gin.Context) (int, any) {
	if ctr.app.MinioClient == nil {
		return http.StatusInternalServerError, errors.New("minio client not initialized")
	}
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		return http.StatusBadRequest, errors.New("failed to get file")
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)
	if ext != ".ttf" && ext != ".otf" && ext != ".woff" {
		return http.StatusBadRequest, errors.New("unsupported font format")
	}

	fontName := c.PostForm("name")
	if fontName == "" {
		return http.StatusBadRequest, errors.New("font name required")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	objectName := fmt.Sprintf("%d/fonts/%s%s", userId, fontName, ext)
	_, err = ctr.app.MinioClient.PutObject(c, os.Getenv("MINIO_BUCKET"), objectName, file, header.Size, minio.PutObjectOptions{ContentType: header.Header.Get("Content-Type")})
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to upload font")
	}

	return http.StatusOK, gin.H{
		"font": fontName,
		"url": objectName,
		"ext": ext,
		"uploaded": time.Now().Unix(),
	}
}
