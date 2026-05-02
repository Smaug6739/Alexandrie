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
	UpdateFile(ctx context.Context, actor permissions.Actor, nodeId types.Snowflake, name string, fileContent []byte, fileSize int64, metadata types.JSONB, mimeType string) (*models.Node, error)
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

// UpdateFile updates an existing file and its associated node
func (s *resourceService) UpdateFile(ctx context.Context, actor permissions.Actor, nodeId types.Snowflake, name string, fileContent []byte, fileSize int64, metadata types.JSONB, mimeType string) (*models.Node, error) {
	if s.minioClient == nil {
		return nil, errors.New("minio client not initialized")
	}

	// Get the existing node
	node, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, errors.New("resource not found")
	}

	// Check permissions - user must have update access
	level, err := s.access.CheckNodeAction(actor, node, permissions.ActionUpdate)
	if err != nil || level == permissions.PermNone {
		return nil, errors.New("insufficient permissions to update this resource")
	}

	// Update file if a new one is provided
	if len(fileContent) > 0 && mimeType != "" {
		// Validate file type
		if !slices.Contains(s.config.SupportedTypes, mimeType) {
			return nil, errors.New("file type not supported")
		}

		// Check if new file size + other uploads would exceed limit
		currentSize := int64(0)
		if node.Size != nil {
			currentSize = *node.Size
		}
		totalSize, err := s.nodeRepo.GetUserUploadsSize(actor.UserID)
		if err != nil {
			return nil, err
		}
		// Calculate the increase in size (new file - old file)
		sizeIncrease := fileSize - currentSize
		if totalSize+sizeIncrease > int64(s.config.MaxUploadsSize) {
			return nil, errors.New("total size of uploads exceeds the limit")
		}

		// Update the file in MinIO
		objectName := fmt.Sprintf("%d/%s", actor.UserID, *node.ContentCompiled)
		fmt.Printf("Updating file in storage: %s\n", objectName)
		_, err = s.minioClient.PutObject(context.Background(), os.Getenv("MINIO_BUCKET"), objectName, bytes.NewReader(fileContent), fileSize, minio.PutObjectOptions{ContentType: mimeType})
		if err != nil {
			return nil, errors.New("failed to update file in storage")
		}

		// Update file-related node fields
		node.Size = &fileSize
		if node.Metadata == nil {
			node.Metadata = &types.JSONB{}
		}
		(*node.Metadata)["filetype"] = mimeType
	}

	// Update node properties if provided
	if name != "" {
		if len(name) > 50 {
			name = name[:50]
		}
		node.Name = name
	}

	// Update timestamp
	node.UpdatedTimestamp = time.Now().UnixMilli()

	// Save the updated node
	if err := s.nodeRepo.Update(node); err != nil {
		return nil, errors.New("failed to update resource in database")
	}

	return node, nil
}
