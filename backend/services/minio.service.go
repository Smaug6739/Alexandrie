package services

import (
	"alexandrie/types"
	"context"
	"fmt"
	"os"

	"github.com/minio/minio-go/v7"
)

type MinioService interface {
	DeleteAllFromUser(userId types.Snowflake) error
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
