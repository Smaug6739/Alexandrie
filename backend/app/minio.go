package app

import (
	"alexandrie/pkg/logger"
	"alexandrie/utils"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/lifecycle"
)

func MinioConnection() (*minio.Client, error) {
	ctx := context.Background()
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESSKEY")
	secretAccessKey := os.Getenv("MINIO_SECRETKEY")
	if endpoint == "" || accessKeyID == "" || secretAccessKey == "" {
		return nil, fmt.Errorf("MINIO NOT CONFIGURED")
	}
	// Initialize minio client object.
	minioClient, errInit := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: true,
	})
	if errInit != nil {
		log.Fatalln(errInit)
	}

	// Setup main public bucket for user files (avatars, uploads, etc.)
	bucketName := os.Getenv("MINIO_BUCKET")
	setupPublicBucket(ctx, minioClient, bucketName)

	// Setup private bucket for backups (only accessible via presigned URLs)
	backupBucket := utils.GetBackupBucketName()
	setupPrivateBackupBucket(ctx, minioClient, backupBucket)

	return minioClient, errInit
}

// setupPublicBucket creates and configures the main public bucket
func setupPublicBucket(ctx context.Context, minioClient *minio.Client, bucketName string) {
	err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			logger.Info(fmt.Sprintf("We already own %s", bucketName))
		} else {
			log.Fatalln(err)
		}
	} else {
		logger.Success("Successfully created " + bucketName)
	}

	// Set public read policy for user files
	policy := fmt.Sprintf(`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": ["*"] },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::%s/*"]
    }
  ]
}`, bucketName)

	err = minioClient.SetBucketPolicy(ctx, bucketName, policy)
	if err != nil {
		log.Fatalf("Failed to set bucket policy: %v", err)
	}
	logger.Success("Successfully set public bucket policy for " + bucketName)
}

// setupPrivateBackupBucket creates and configures the private backup bucket
func setupPrivateBackupBucket(ctx context.Context, minioClient *minio.Client, bucketName string) {
	err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			logger.Info(fmt.Sprintf("We already own %s", bucketName))
		} else {
			log.Fatalln(err)
		}
	} else {
		logger.Success("Successfully created private backup bucket: " + bucketName)
	}

	// No public policy - bucket remains private
	// Backups are only accessible via presigned URLs

	// Configure lifecycle rule to auto-delete backup files after 1 day
	lifecycleConfig := lifecycle.NewConfiguration()
	lifecycleConfig.Rules = []lifecycle.Rule{
		{
			ID:     "auto-delete-backups",
			Status: "Enabled",
			Expiration: lifecycle.Expiration{
				Days: 1,
			},
		},
	}

	err = minioClient.SetBucketLifecycle(ctx, bucketName, lifecycleConfig)
	if err != nil {
		logger.Warn(fmt.Sprintf("Failed to set lifecycle policy for backups: %v", err))
	} else {
		logger.Success("Successfully set lifecycle policy for backups (auto-delete after 24h)")
	}
}
