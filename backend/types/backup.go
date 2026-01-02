package types

import (
	"encoding/json"
	"time"
)

// BackupStatus represents the current state of a backup job
type BackupStatus string

const (
	BackupStatusPending    BackupStatus = "pending"
	BackupStatusProcessing BackupStatus = "processing"
	BackupStatusCompleted  BackupStatus = "completed"
	BackupStatusFailed     BackupStatus = "failed"
)

// BackupOptions defines what data to include in the backup
type BackupOptions struct {
	IncludeDocuments bool `json:"include_documents"` // Include documents/notes content
	IncludeFiles     bool `json:"include_files"`     // Include uploaded files (images, PDFs, etc.)
	IncludeSettings  bool `json:"include_settings"`  // Include user settings and preferences
	IncludeMetadata  bool `json:"include_metadata"`  // Include node metadata
}

// DefaultBackupOptions returns the default backup options (everything included)
func DefaultBackupOptions() BackupOptions {
	return BackupOptions{
		IncludeDocuments: true,
		IncludeFiles:     true,
		IncludeSettings:  true,
		IncludeMetadata:  true,
	}
}

// BackupJob represents an ongoing or completed backup job
type BackupJob struct {
	ID          string        `json:"id"`
	UserID      Snowflake     `json:"user_id"`
	Status      BackupStatus  `json:"status"`
	Options     BackupOptions `json:"options"`
	Progress    int           `json:"progress"`               // 0-100
	Message     string        `json:"message"`                // Current status message
	DownloadURL string        `json:"download_url,omitempty"` // Available when completed
	Error       string        `json:"error,omitempty"`        // Error message if failed
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	ExpiresAt   time.Time     `json:"expires_at,omitempty"` // When the backup file will be deleted
}

// BackupManifest contains metadata about the backup contents
type BackupManifest struct {
	Version    string        `json:"version"`
	CreatedAt  time.Time     `json:"created_at"`
	UserID     Snowflake     `json:"user_id"`
	Options    BackupOptions `json:"options"`
	Statistics BackupStats   `json:"statistics"`
}

// BackupStats contains statistics about the backup contents
type BackupStats struct {
	TotalNodes     int           `json:"total_nodes"`
	TotalDocuments int           `json:"total_documents"`
	TotalFiles     int           `json:"total_files"`
	TotalSize      int64         `json:"total_size_bytes"`
	SkippedFiles   []SkippedFile `json:"skipped_files,omitempty"`
}

// SkippedFile represents a file that was skipped during backup
type SkippedFile struct {
	ID     Snowflake `json:"id"`
	Name   string    `json:"name"`
	Reason string    `json:"reason"`
}

// MarshalJSON ensures proper JSON encoding
func (bo BackupOptions) MarshalJSON() ([]byte, error) {
	type Alias BackupOptions
	return json.Marshal(&struct{ Alias }{Alias: Alias(bo)})
}
