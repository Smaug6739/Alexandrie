package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"bytes"
	"context"
	"errors"
	"fmt"
	"maps"
	"os"
	"path/filepath"
	"slices"
	"time"

	"github.com/minio/minio-go/v7"
)

type ResourceConfig struct {
	MaxUploadsSize       float64
	SupportedTypes       []string
	SupportedTypesImages []string
}

type ResourceService interface {
	UploadFile(ctx context.Context, filename string, fileSize int64, fileContent []byte, metadata types.JSONB, mimeType string, parentId *types.Snowflake) (*models.Node, error)
	UploadAvatar(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake) error
}

type resourceService struct {
	nodeRepo    repositories.NodeRepository
	snowflake   *snowflake.Snowflake
	minioClient *minio.Client
	config      ResourceConfig
	access      permissions.AccessGuard
}

func NewResourceService(nodeRepo repositories.NodeRepository, snowflake *snowflake.Snowflake, minioClient *minio.Client, config ResourceConfig, access permissions.AccessGuard) ResourceService {
	return &resourceService{
		nodeRepo:    nodeRepo,
		snowflake:   snowflake,
		minioClient: minioClient,
		config:      config,
		access:      access,
	}
}

func (s *resourceService) UploadFile(ctx context.Context, filename string, fileSize int64, fileContent []byte, metadata types.JSONB, mimeType string, parentId *types.Snowflake) (*models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	userId := actor.UserID

	if s.minioClient == nil {
		return nil, errors.New("minio client not initialized")
	}

	if !slices.Contains(s.config.SupportedTypes, mimeType) {
		return nil, errors.New("file type not supported")
	}

	totalSize, err := s.nodeRepo.GetUserUploadsSize(userId)
	if err != nil {
		return nil, err
	}
	if totalSize+fileSize > int64(s.config.MaxUploadsSize) {
		return nil, errors.New("total size of uploads exceeds the limit")
	}

	id := s.snowflake.Generate()
	ext := filepath.Ext(filename)
	transformedPath := fmt.Sprintf("%d%s", id, ext)
	metadata_final := types.JSONB{
		"filetype":         mimeType,
		"original_path":    filename,
		"transformed_path": transformedPath,
	}
	maps.Copy(metadata_final, metadata)

	name := filename
	if len(name) > 50 {
		name = name[:50]
	}
	accessibility := utils.IntPtr(1)

	// Parent ID: Check if exists and user has permissions to create under it
	safeParentId := parentId
	if parentId != nil {
		parentNode, err := s.nodeRepo.GetByID(*parentId)
		if err != nil {
			safeParentId = nil
		}
		if parentNode != nil {
			level, err := s.access.CheckNodeAction(actor, parentNode, permissions.ActionUpdate)
			if err != nil || level == permissions.PermNone {
				safeParentId = nil
			}
		}
	}

	node := &models.Node{
		Id:               id,
		UserId:           userId,
		ParentId:         safeParentId,
		Name:             name,
		Role:             4,
		Accessibility:    accessibility,
		Access:           0,
		Size:             &fileSize,
		Content:          &filename,
		ContentCompiled:  &transformedPath,
		Metadata:         &metadata_final,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Create(node); err != nil {
		return nil, err
	}

	objectName := fmt.Sprintf("%d/%d%s", userId, id, ext)
	_, err = s.minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(fileContent), fileSize, minio.PutObjectOptions{ContentType: mimeType})
	if err != nil {
		return nil, err
	}

	return node, nil
}

func (s *resourceService) UploadAvatar(filename string, fileSize int64, fileContent []byte, mimeType string, userId types.Snowflake) error {
	if s.minioClient == nil {
		return errors.New("minio client not initialized")
	}

	if !slices.Contains(s.config.SupportedTypesImages, mimeType) {
		return errors.New("file type not supported")
	}

	objectName := fmt.Sprintf("%d/avatar", userId)
	_, err := s.minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(fileContent), fileSize, minio.PutObjectOptions{ContentType: mimeType})
	return err
}
