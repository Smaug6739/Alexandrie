package services

import (
	"alexandrie/models"
	"alexandrie/pkg/logger"
	"alexandrie/types"
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/minio/minio-go/v7"
)

type MinioService interface {
	DeleteAllFromUser(userId types.Snowflake) error
	DeleteNodeFiles(resources []*models.NodeResourceInfo) error
	DeleteSingleResource(userId types.Snowflake, nodeId types.Snowflake, metadata *types.JSONB) error
}

type minioService struct {
	minioClient *minio.Client
}

func NewMinioService(minioClient *minio.Client) MinioService {
	return &minioService{
		minioClient: minioClient,
	}
}

func (s *minioService) DeleteAllFromUser(userId types.Snowflake) error {
	if s.minioClient == nil {
		return nil
	}

	prefix := fmt.Sprintf("%d/", userId)
	ctx := context.Background()
	objectCh := s.minioClient.ListObjects(ctx, os.Getenv("MINIO_BUCKET"), minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	for object := range objectCh {
		if object.Err != nil {
			return object.Err
		}
		err := s.minioClient.RemoveObject(ctx, os.Getenv("MINIO_BUCKET"), object.Key, minio.RemoveObjectOptions{})
		if err != nil {
			return fmt.Errorf("failed to delete object: %v", err)
		}
	}
	return nil
}

// DeleteNodeFiles deletes MinIO files for a list of resource nodes
// This is used when deleting a node that may have descendant resources
func (s *minioService) DeleteNodeFiles(resources []*models.NodeResourceInfo) error {
	if s.minioClient == nil {
		return nil
	}

	if len(resources) == 0 {
		return nil
	}

	ctx := context.Background()
	bucket := os.Getenv("MINIO_BUCKET")
	var lastErr error

	for _, res := range resources {
		if err := s.DeleteSingleResource(res.UserId, res.Id, res.Metadata); err != nil {
			// Log error but continue deleting other files
			logger.Warn(fmt.Sprintf("Failed to delete MinIO file for node %d: %v", res.Id, err))
			lastErr = err
		}
	}

	// Also try to delete by prefix as fallback (catches any orphaned files)
	for _, res := range resources {
		prefix := fmt.Sprintf("%d/%d", res.UserId, res.Id)
		objectCh := s.minioClient.ListObjects(ctx, bucket, minio.ListObjectsOptions{
			Prefix:    prefix,
			Recursive: true,
		})

		for object := range objectCh {
			if object.Err != nil {
				logger.Warn(fmt.Sprintf("Error listing objects with prefix %s: %v", prefix, object.Err))
				continue
			}
			if err := s.minioClient.RemoveObject(ctx, bucket, object.Key, minio.RemoveObjectOptions{}); err != nil {
				logger.Warn(fmt.Sprintf("Failed to delete object %s: %v", object.Key, err))
				lastErr = err
			}
		}
	}

	return lastErr
}

// DeleteSingleResource deletes a single resource file from MinIO
func (s *minioService) DeleteSingleResource(userId types.Snowflake, nodeId types.Snowflake, metadata *types.JSONB) error {
	if s.minioClient == nil {
		return nil
	}

	ctx := context.Background()
	bucket := os.Getenv("MINIO_BUCKET")

	// Try to get the exact path from metadata
	if metadata != nil {
		if transformedPath, ok := (*metadata)["transformed_path"].(string); ok && transformedPath != "" {
			ext := filepath.Ext(transformedPath)
			objectName := fmt.Sprintf("%d/%d%s", userId, nodeId, ext)
			if err := s.minioClient.RemoveObject(ctx, bucket, objectName, minio.RemoveObjectOptions{}); err != nil {
				return fmt.Errorf("failed to delete object %s: %w", objectName, err)
			}
			return nil
		}
	}

	// Fallback: delete by prefix (handles cases where metadata is missing or malformed)
	prefix := fmt.Sprintf("%d/%d", userId, nodeId)
	objectCh := s.minioClient.ListObjects(ctx, bucket, minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	for object := range objectCh {
		if object.Err != nil {
			return object.Err
		}
		if err := s.minioClient.RemoveObject(ctx, bucket, object.Key, minio.RemoveObjectOptions{}); err != nil {
			return fmt.Errorf("failed to delete object %s: %w", object.Key, err)
		}
	}

	return nil
}
