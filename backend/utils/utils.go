package utils

import "os"

func IfNotNilPointer[T any](newValue, defaultValue *T) *T {
	if newValue != nil {
		return newValue
	}
	return defaultValue
}
func IfNotNilValue[T any](newValue *T, defaultValue T) T {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}

func IntPtr(i int) *int {
	return &i
}

// GetBackupBucketName returns the name of the private backup bucket
func GetBackupBucketName() string {
	baseBucket := os.Getenv("MINIO_BUCKET")
	return baseBucket + "-backups"
}
