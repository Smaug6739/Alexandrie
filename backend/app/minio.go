package app

import (
	"alexandrie/pkg/logger"
	"alexandrie/utils"
	"context"
	"fmt"
	"net/url"
	"os"
	"strings"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/lifecycle"
)

func MinioConnection() (*minio.Client, *minio.Client, error) {
	ctx := context.Background()

	internalEndpoint := os.Getenv("MINIO_ENDPOINT")
	publicEndpoint := os.Getenv("MINIO_PUBLIC_URL")

	accessKeyID := os.Getenv("MINIO_ACCESSKEY")
	secretAccessKey := os.Getenv("MINIO_SECRETKEY")

	if internalEndpoint == "" || accessKeyID == "" || secretAccessKey == "" {
		return nil, nil, fmt.Errorf("MINIO NOT CONFIGURED")
	}

	// HTTPS detection
	isSecure := true
	if os.Getenv("MINIO_SECURE") != "" && os.Getenv("MINIO_SECURE") != "true" {
		isSecure = false
	} else if strings.HasPrefix(internalEndpoint, "localhost") || strings.HasPrefix(internalEndpoint, "127.") {
		isSecure = false
	}

	// Initialize minio client object.
	minioClient, errInit := minio.New(internalEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: isSecure,
	})
	if errInit != nil {
		logger.Error(fmt.Sprintf("Failed to initialize MinIO client: %v", errInit))
		os.Exit(1)
	}

	// Signer client for public URLs
	publicURL, err := url.Parse(publicEndpoint)
	if err != nil {
		logger.Error("CONFIG: MINIO_PUBLIC_URL is not a valid URL")
		os.Exit(1)
	}
	isPublicSecure := publicURL.Scheme == "https"
	signerClient, err := minio.New(publicURL.Host, &minio.Options{
		Creds:        credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure:       isPublicSecure,
		BucketLookup: minio.BucketLookupPath,
	})
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to create signer client: %v", err))
		logger.Error("Please check your MINIO_PUBLIC_URL is set correctly.")
		os.Exit(1)
	}

	// Setup main public bucket for user files (avatars, uploads, etc.)
	bucketName := os.Getenv("MINIO_BUCKET")
	setupPublicBucket(ctx, minioClient, bucketName)

	// Setup private bucket for backups (only accessible via presigned URLs)
	backupBucket := utils.GetBackupBucketName()
	setupPrivateBackupBucket(ctx, minioClient, backupBucket)

	return minioClient, signerClient, errInit
}

// setupPublicBucket creates and configures the main public bucket
func setupPublicBucket(ctx context.Context, minioClient *minio.Client, bucketName string) {
	err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := minioClient.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			logger.Info(fmt.Sprintf("We already own %s", bucketName))
		} else {
			logger.Error(fmt.Sprintf("Failed to create bucket %s: %v", bucketName, err))
			os.Exit(1)
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
		logger.Error(fmt.Sprintf("Failed to set bucket policy: %v", err))
		os.Exit(1)
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
			logger.Error(fmt.Sprintf("Failed to create private backup bucket %s: %v", bucketName, err))
			os.Exit(1)
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
