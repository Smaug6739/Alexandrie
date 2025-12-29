package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"time"

	"github.com/minio/minio-go/v7"
)

type RessourceService interface {
	CreateBackup(userId types.Snowflake, minioClient *minio.Client) (string, error)
	UploadFile(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake, maxSize, maxUploadsSize float64, supportedTypes []string, minioClient *minio.Client) (*models.Node, error)
	UploadAvatar(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake, maxSize float64, supportedTypes []string, minioClient *minio.Client) error
}

type ressourceService struct {
	nodeRepo  repositories.NodeRepository
	snowflake *utils.Snowflake
}

func NewRessourceService(nodeRepo repositories.NodeRepository, snowflake *utils.Snowflake) RessourceService {
	return &ressourceService{
		nodeRepo:  nodeRepo,
		snowflake: snowflake,
	}
}

func (s *ressourceService) CreateBackup(userId types.Snowflake, minioClient *minio.Client) (string, error) {
	if minioClient == nil {
		return "", errors.New("minio client not initialized")
	}

	nodes, err := s.nodeRepo.GetAllForBackup(userId)
	if err != nil {
		return "", err
	}

	backup := map[string]interface{}{
		"nodes": nodes,
	}
	jsonString, err := json.Marshal(backup)
	if err != nil {
		return "", err
	}

	objectName := fmt.Sprintf("%d/backups/backup.json", userId)
	_, err = minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(jsonString), int64(len(jsonString)), minio.PutObjectOptions{ContentType: "application/json"})
	if err != nil {
		return "", err
	}

	return objectName, nil
}

func (s *ressourceService) UploadFile(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake, maxSize, maxUploadsSize float64, supportedTypes []string, minioClient *minio.Client) (*models.Node, error) {
	if minioClient == nil {
		return nil, errors.New("minio client not initialized")
	}

	if fileSize > int64(maxSize) {
		return nil, errors.New("file size exceeds the limit")
	}

	if !slices.Contains(supportedTypes, mimeType) {
		return nil, errors.New("file type not supported")
	}

	totalSize, err := s.nodeRepo.GetUserUploadsSize(userId)
	if err != nil {
		return nil, err
	}
	if totalSize+fileSize > int64(maxUploadsSize) {
		return nil, errors.New("total size of uploads exceeds the limit")
	}

	id := s.snowflake.Generate()
	ext := filepath.Ext(filename)
	transformedPath := fmt.Sprintf("%d%s", id, ext)
	metadata := types.JSONB{
		"filetype":         mimeType,
		"original_path":    filename,
		"transformed_path": transformedPath,
	}

	name := filename
	if len(name) > 50 {
		name = name[:50]
	}
	accessibility := utils.IntPtr(1)

	node := &models.Node{
		Id:               id,
		UserId:           userId,
		ParentId:         nil,
		Name:             name,
		Role:             4,
		Accessibility:    accessibility,
		Access:           0,
		Size:             &fileSize,
		Content:          &filename,
		ContentCompiled:  &transformedPath,
		Metadata:         &metadata,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Create(node); err != nil {
		return nil, err
	}

	objectName := fmt.Sprintf("%d/%d%s", userId, id, ext)
	_, err = minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(fileContent), fileSize, minio.PutObjectOptions{ContentType: mimeType})
	if err != nil {
		return nil, err
	}

	return node, nil
}

func (s *ressourceService) UploadAvatar(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake, maxSize float64, supportedTypes []string, minioClient *minio.Client) error {
	if minioClient == nil {
		return errors.New("minio client not initialized")
	}

	if fileSize > int64(maxSize) {
		return errors.New("file size exceeds the limit")
	}

	if !slices.Contains(supportedTypes, mimeType) {
		return errors.New("file type not supported")
	}

	objectName := fmt.Sprintf("%d/avatar", userId)
	_, err := minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(fileContent), fileSize, minio.PutObjectOptions{ContentType: mimeType})
	return err
}
