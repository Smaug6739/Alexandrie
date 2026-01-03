package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/minio/minio-go/v7"
)

const (
	backupVersion      = "1.0.0"
	backupExpiryHours  = 24 // Backup files expire after 24 hours
	maxConcurrentFiles = 5  // Max concurrent file downloads for backup
)

// BackupService handles backup creation and management
type BackupService interface {
	// CreateBackupAsync starts an async backup job and returns the job ID
	CreateBackupAsync(userId types.Snowflake, options types.BackupOptions, minioClient *minio.Client) (string, error)
	// GetBackupStatus returns the current status of a backup job
	GetBackupStatus(userId types.Snowflake, jobId string) (*types.BackupJob, error)
	// CancelBackup cancels an ongoing backup job
	CancelBackup(userId types.Snowflake, jobId string) error
	// CleanupExpiredBackups removes expired backup files
	CleanupExpiredBackups(minioClient *minio.Client) error
}

type backupService struct {
	nodeRepo repositories.NodeRepository
	jobs     map[string]*types.BackupJob
	userJobs map[types.Snowflake]string // Maps userId to current jobId
	jobMutex sync.RWMutex
	cancel   map[string]context.CancelFunc
}

// NewBackupService creates a new backup service instance
func NewBackupService(nodeRepo repositories.NodeRepository) BackupService {
	return &backupService{
		nodeRepo: nodeRepo,
		jobs:     make(map[string]*types.BackupJob),
		userJobs: make(map[types.Snowflake]string),
		cancel:   make(map[string]context.CancelFunc),
	}
}

// CreateBackupAsync starts an asynchronous backup job
func (s *backupService) CreateBackupAsync(userId types.Snowflake, options types.BackupOptions, minioClient *minio.Client) (string, error) {
	if minioClient == nil {
		return "", errors.New("minio client not initialized")
	}

	// Cancel any existing backup for this user
	s.cancelExistingBackup(userId, minioClient)

	// Use a fixed job ID per user so backups are replaced
	jobId := fmt.Sprintf("user-%d-backup", userId)

	// Create job entry
	job := &types.BackupJob{
		ID:        jobId,
		UserID:    userId,
		Status:    types.BackupStatusPending,
		Options:   options,
		Progress:  0,
		Message:   "Initializing backup...",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Store job
	s.jobMutex.Lock()
	s.jobs[jobId] = job
	s.userJobs[userId] = jobId
	s.jobMutex.Unlock()

	// Create cancellation context
	ctx, cancel := context.WithCancel(context.Background())
	s.jobMutex.Lock()
	s.cancel[jobId] = cancel
	s.jobMutex.Unlock()

	// Start async processing
	go s.processBackup(ctx, job, minioClient)

	return jobId, nil
}

// cancelExistingBackup cancels any ongoing backup and removes the old backup file
func (s *backupService) cancelExistingBackup(userId types.Snowflake, minioClient *minio.Client) {
	s.jobMutex.Lock()
	defer s.jobMutex.Unlock()

	// Check if user has an existing job
	existingJobId, exists := s.userJobs[userId]
	if !exists {
		return
	}

	existingJob, jobExists := s.jobs[existingJobId]
	if !jobExists {
		delete(s.userJobs, userId)
		return
	}

	// Cancel if still running
	if existingJob.Status == types.BackupStatusPending || existingJob.Status == types.BackupStatusProcessing {
		if cancel, ok := s.cancel[existingJobId]; ok {
			cancel()
			delete(s.cancel, existingJobId)
		}
	}

	// Delete the old backup file from MinIO (private backup bucket)
	if minioClient != nil {
		objectName := fmt.Sprintf("%d/backup.zip", userId)
		backupBucket := utils.GetBackupBucketName()
		_ = minioClient.RemoveObject(context.Background(), backupBucket, objectName, minio.RemoveObjectOptions{})
	}

	// Remove old job
	delete(s.jobs, existingJobId)
}

// GetBackupStatus returns the current status of a backup job
func (s *backupService) GetBackupStatus(userId types.Snowflake, jobId string) (*types.BackupJob, error) {
	s.jobMutex.RLock()
	defer s.jobMutex.RUnlock()

	job, exists := s.jobs[jobId]
	if !exists {
		return nil, errors.New("backup job not found")
	}

	// Verify ownership
	if job.UserID != userId {
		return nil, errors.New("unauthorized access to backup job")
	}

	return job, nil
}

// CancelBackup cancels an ongoing backup job
func (s *backupService) CancelBackup(userId types.Snowflake, jobId string) error {
	s.jobMutex.Lock()
	defer s.jobMutex.Unlock()

	job, exists := s.jobs[jobId]
	if !exists {
		return errors.New("backup job not found")
	}

	if job.UserID != userId {
		return errors.New("unauthorized access to backup job")
	}

	if job.Status == types.BackupStatusCompleted || job.Status == types.BackupStatusFailed {
		return errors.New("backup job already finished")
	}

	// Cancel the context
	if cancel, ok := s.cancel[jobId]; ok {
		cancel()
		delete(s.cancel, jobId)
	}

	job.Status = types.BackupStatusFailed
	job.Error = "Backup cancelled by user"
	job.UpdatedAt = time.Now()

	return nil
}

// CleanupExpiredBackups cleans up expired job entries from memory.
// Note: The actual backup files are automatically deleted by MinIO lifecycle policy after 24h.
// This function only cleans up the in-memory job tracking.
func (s *backupService) CleanupExpiredBackups(minioClient *minio.Client) error {
	s.jobMutex.Lock()
	defer s.jobMutex.Unlock()

	now := time.Now()

	for jobId, job := range s.jobs {
		if job.Status == types.BackupStatusCompleted && !job.ExpiresAt.IsZero() && now.After(job.ExpiresAt) {
			// Clean up in-memory job tracking (files are auto-deleted by MinIO lifecycle)
			delete(s.jobs, jobId)
			delete(s.userJobs, job.UserID)
		}
	}

	return nil
}

// processBackup is the main backup processing goroutine
func (s *backupService) processBackup(ctx context.Context, job *types.BackupJob, minioClient *minio.Client) {
	defer func() {
		if r := recover(); r != nil {
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Backup failed: %v", r))
		}
	}()

	s.updateJobStatus(job, types.BackupStatusProcessing, 5, "Fetching data...", "")

	// Check for cancellation
	select {
	case <-ctx.Done():
		return
	default:
	}

	// Fetch all nodes for backup
	nodes, err := s.nodeRepo.GetAllForBackup(job.UserID)
	if err != nil {
		s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to fetch nodes: %v", err))
		return
	}

	s.updateJobStatus(job, types.BackupStatusProcessing, 15, "Preparing backup archive...", "")

	// Create ZIP archive in memory
	var buf bytes.Buffer
	zipWriter := zip.NewWriter(&buf)

	// Prepare backup statistics
	stats := types.BackupStats{
		TotalNodes: len(nodes),
	}

	// Filter and categorize nodes
	var documents []*models.Node
	var files []*models.Node

	for _, node := range nodes {
		if node.Role == 4 { // Role 4 is file/resource
			files = append(files, node)
			stats.TotalFiles++
		} else {
			documents = append(documents, node)
			stats.TotalDocuments++
		}
	}

	s.updateJobStatus(job, types.BackupStatusProcessing, 25, "Processing documents...", "")

	// Add documents to backup
	if job.Options.IncludeDocuments {
		documentsData, err := s.prepareDocumentsData(documents, job.Options.IncludeMetadata)
		if err != nil {
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to prepare documents: %v", err))
			return
		}

		if err := s.addJSONToZip(zipWriter, "documents.json", documentsData); err != nil {
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to add documents to archive: %v", err))
			return
		}
	}

	select {
	case <-ctx.Done():
		return
	default:
	}

	s.updateJobStatus(job, types.BackupStatusProcessing, 40, "Processing files...", "")

	// Add files to backup
	if job.Options.IncludeFiles && len(files) > 0 {
		if err := s.addFilesToZip(ctx, zipWriter, files, job, minioClient, &stats); err != nil {
			if ctx.Err() != nil {
				return // Cancelled
			}
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to add files to archive: %v", err))
			return
		}
	}

	// Check for cancellation
	select {
	case <-ctx.Done():
		return
	default:
	}

	if job.Options.LocalData != nil {
		s.updateJobStatus(job, types.BackupStatusProcessing, 80, "Adding local data...", "")
		if err := s.addJSONToZip(zipWriter, "local_data.json", job.Options.LocalData); err != nil {
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to add local data: %v", err))
			return
		}
	}

	// Check for cancellation
	select {
	case <-ctx.Done():
		return
	default:
	}

	s.updateJobStatus(job, types.BackupStatusProcessing, 85, "Creating manifest...", "")

	// Create and add manifest
	manifest := types.BackupManifest{
		Version:   backupVersion,
		CreatedAt: time.Now(),
		UserID:    job.UserID,
		Options: types.BackupOptions{
			IncludeDocuments: job.Options.IncludeDocuments,
			IncludeFiles:     job.Options.IncludeFiles,
			IncludeMetadata:  job.Options.IncludeMetadata,
		},
		Statistics: stats,
	}

	if err := s.addJSONToZip(zipWriter, "manifest.json", manifest); err != nil {
		s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to add manifest: %v", err))
		return
	}

	// Add file index for easier restoration
	if job.Options.IncludeFiles && len(files) > 0 {
		fileIndex := s.createFileIndex(files)
		if err := s.addJSONToZip(zipWriter, "files_index.json", fileIndex); err != nil {
			s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to add file index: %v", err))
			return
		}
	}

	// Close ZIP writer
	if err := zipWriter.Close(); err != nil {
		s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to finalize archive: %v", err))
		return
	}

	s.updateJobStatus(job, types.BackupStatusProcessing, 90, "Uploading backup...", "")

	// Upload to private backup bucket (only accessible via presigned URLs)
	objectName := fmt.Sprintf("%d/backup.zip", job.UserID)
	backupBucket := utils.GetBackupBucketName()

	_, err = minioClient.PutObject(
		context.Background(),
		backupBucket,
		objectName,
		bytes.NewReader(buf.Bytes()),
		int64(buf.Len()),
		minio.PutObjectOptions{ContentType: "application/zip"},
	)
	if err != nil {
		s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to upload backup: %v", err))
		return
	}

	stats.TotalSize = int64(buf.Len())

	// Generate presigned URL for download (valid for 24 hours)
	// This is the ONLY way to access the backup since the bucket is private
	reqParams := make(url.Values)
	reqParams.Set(
		"response-content-disposition",
		`attachment; filename="alexandrie-backup-`+time.Now().Format("2006-01-02 15:04:05")+`.zip"`,
	)

	presignedURL, err := minioClient.PresignedGetObject(
		context.Background(),
		backupBucket,
		objectName,
		time.Duration(backupExpiryHours)*time.Hour,
		reqParams,
	)
	if err != nil {
		s.updateJobStatus(job, types.BackupStatusFailed, 0, "", fmt.Sprintf("Failed to generate download URL: %v", err))
		return
	}

	// Update job with completion status
	s.jobMutex.Lock()
	job.Status = types.BackupStatusCompleted
	job.Progress = 100
	job.Message = "Backup completed successfully"
	job.DownloadURL = presignedURL.String()
	job.ExpiresAt = time.Now().Add(time.Duration(backupExpiryHours) * time.Hour)
	job.UpdatedAt = time.Now()
	s.jobMutex.Unlock()
}

// updateJobStatus safely updates the job status
func (s *backupService) updateJobStatus(job *types.BackupJob, status types.BackupStatus, progress int, message string, errorMsg string) {
	s.jobMutex.Lock()
	defer s.jobMutex.Unlock()

	job.Status = status

	// Handle failed status: update message to reflect failure
	if status == types.BackupStatusFailed {
		job.Message = "Backup failed"
		if errorMsg != "" {
			job.Error = errorMsg
		}
	} else {
		if progress > 0 {
			job.Progress = progress
		}
		if message != "" {
			job.Message = message
		}
	}

	job.UpdatedAt = time.Now()
}

// prepareDocumentsData prepares document nodes for backup
func (s *backupService) prepareDocumentsData(documents []*models.Node, includeMetadata bool) (interface{}, error) {
	if !includeMetadata {
		// Strip metadata from documents
		stripped := make([]map[string]interface{}, len(documents))
		for i, doc := range documents {
			stripped[i] = map[string]interface{}{
				"id":                doc.Id,
				"parent_id":         doc.ParentId,
				"name":              doc.Name,
				"description":       doc.Description,
				"tags":              doc.Tags,
				"role":              doc.Role,
				"color":             doc.Color,
				"icon":              doc.Icon,
				"theme":             doc.Theme,
				"accessibility":     doc.Accessibility,
				"access":            doc.Access,
				"order":             doc.Order,
				"content":           doc.Content,
				"content_compiled":  doc.ContentCompiled,
				"created_timestamp": doc.CreatedTimestamp,
				"updated_timestamp": doc.UpdatedTimestamp,
			}
		}
		return stripped, nil
	}
	return documents, nil
}

// addJSONToZip adds a JSON file to the ZIP archive
func (s *backupService) addJSONToZip(zipWriter *zip.Writer, filename string, data interface{}) error {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	writer, err := zipWriter.Create(filename)
	if err != nil {
		return err
	}

	_, err = writer.Write(jsonData)
	return err
}

// addFilesToZip downloads and adds files to the ZIP archive
func (s *backupService) addFilesToZip(ctx context.Context, zipWriter *zip.Writer, files []*models.Node, job *types.BackupJob, minioClient *minio.Client, stats *types.BackupStats) error {
	bucket := os.Getenv("MINIO_BUCKET")

	// Process files with a semaphore for concurrency control
	sem := make(chan struct{}, maxConcurrentFiles)
	var wg sync.WaitGroup
	var mu sync.Mutex

	totalFiles := len(files)
	processedFiles := 0

	for _, file := range files {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		wg.Add(1)
		sem <- struct{}{} // Acquire semaphore

		go func(f *models.Node) {
			defer wg.Done()
			defer func() { <-sem }() // Release semaphore

			// Get file path from metadata
			var objectPath string
			if f.Metadata != nil {
				if transformedPath, ok := (*f.Metadata)["transformed_path"].(string); ok {
					objectPath = fmt.Sprintf("%d/%s", job.UserID, transformedPath)
				}
			}

			if objectPath == "" {
				// Fallback: try to construct path from content_compiled
				if f.ContentCompiled != nil {
					objectPath = fmt.Sprintf("%d/%s", job.UserID, *f.ContentCompiled)
				}
			}

			if objectPath == "" {
				mu.Lock()
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: "no path found in metadata",
				})
				mu.Unlock()
				return // Skip file because we can't determine its path
			}

			// Download file from MinIO
			obj, err := minioClient.GetObject(ctx, bucket, objectPath, minio.GetObjectOptions{})
			if err != nil {
				mu.Lock()
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: fmt.Sprintf("failed to get object: %v", err),
				})
				mu.Unlock()
				return // Skip file on error
			}
			defer obj.Close()

			// Check if object exists by reading stat
			_, err = obj.Stat()
			if err != nil {
				mu.Lock()
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: "file not found in storage",
				})
				mu.Unlock()
				return // Skip file if not found
			}

			// Read file content
			content, err := io.ReadAll(obj)
			if err != nil {
				mu.Lock()
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: fmt.Sprintf("failed to read content: %v", err),
				})
				mu.Unlock()
				// logger.Warn(fmt.Sprintf("Skipping file %d: failed to read %s: %v", f.Id, objectPath, err))
				return
			}

			// Determine filename for archive
			archivePath := fmt.Sprintf("files/%d%s", f.Id, filepath.Ext(f.Name))
			if f.Metadata != nil {
				if originalPath, ok := (*f.Metadata)["original_path"].(string); ok {
					archivePath = fmt.Sprintf("files/%d_%s", f.Id, filepath.Base(originalPath))
				}
			}

			// Add to ZIP (synchronized to avoid concurrent writes)
			mu.Lock()
			writer, err := zipWriter.Create(archivePath)
			if err != nil {
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: fmt.Sprintf("failed to create zip entry: %v", err),
				})
				mu.Unlock()
				// logger.Warn(fmt.Sprintf("Skipping file %d: failed to create zip entry: %v", f.Id, err))
				return
			}

			_, err = writer.Write(content)
			if err != nil {
				stats.SkippedFiles = append(stats.SkippedFiles, types.SkippedFile{
					ID:     f.Id,
					Name:   f.Name,
					Reason: fmt.Sprintf("failed to write to zip: %v", err),
				})
				mu.Unlock()
				// logger.Warn(fmt.Sprintf("Skipping file %d: failed to write to zip: %v", f.Id, err))
				return
			}

			processedFiles++
			stats.TotalSize += int64(len(content))
			mu.Unlock()

			// Update progress
			progress := 40 + int(float64(processedFiles)/float64(totalFiles)*40)
			s.updateJobStatus(job, types.BackupStatusProcessing, progress, fmt.Sprintf("Processing files (%d/%d)...", processedFiles, totalFiles), "")

		}(file)
	}

	wg.Wait()

	return nil
}

// createFileIndex creates an index mapping file IDs to their archive paths
func (s *backupService) createFileIndex(files []*models.Node) []map[string]interface{} {
	index := make([]map[string]interface{}, len(files))
	for i, f := range files {
		archivePath := fmt.Sprintf("files/%d%s", f.Id, filepath.Ext(f.Name))
		if f.Metadata != nil {
			if originalPath, ok := (*f.Metadata)["original_path"].(string); ok {
				archivePath = fmt.Sprintf("files/%d_%s", f.Id, filepath.Base(originalPath))
			}
		}

		entry := map[string]interface{}{
			"id":           f.Id,
			"name":         f.Name,
			"archive_path": archivePath,
			"size":         f.Size,
			"metadata":     f.Metadata,
		}
		index[i] = entry
	}
	return index
}
