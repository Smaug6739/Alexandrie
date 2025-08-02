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

func NewMinioService(minio *minio.Client) MinioService {
	return &Service{minio: minio}
}

// DeleteAllFromUser
// @Summary Delete all files from a user
// @Security Authenfification: Auth, Self
// @Param id prefix in the bucket
func (s *Service) DeleteAllFromUser(userId types.Snowflake) error {
	if s.minio == nil {
		return nil // Minio client is not enabled, nothing to delete
	}
	prefix := fmt.Sprintf("%d/", userId)
	ctx := context.Background()
	objectCh := s.minio.ListObjects(ctx, os.Getenv("MINIO_BUCKET"), minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	// Delete each object
	for object := range objectCh {
		if object.Err != nil {
			return object.Err
		}
		err := s.minio.RemoveObject(ctx, os.Getenv("MINIO_BUCKET"), object.Key, minio.RemoveObjectOptions{})
		if err != nil {
			return fmt.Errorf("failed to delete object: %v", err)
		}
	}
	return nil
}
