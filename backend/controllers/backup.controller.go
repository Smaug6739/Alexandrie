package controllers

import (
	"alexandrie/app"
	"alexandrie/permissions"
	"alexandrie/types"
	"alexandrie/utils"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BackupController interface {
	CreateBackup(c *gin.Context) (int, any)
	GetBackupStatus(c *gin.Context) (int, any)
	CancelBackup(c *gin.Context) (int, any)
}

func NewBackupController(app *app.App) BackupController {
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
	}
}

// CreateBackupRequest represents the request body for creating a backup
type CreateBackupRequest struct {
	IncludeDocuments *bool `json:"include_documents"` // Include documents/notes content
	IncludeFiles     *bool `json:"include_files"`     // Include uploaded files
	IncludeSettings  *bool `json:"include_settings"`  // Include user settings
	IncludeMetadata  *bool `json:"include_metadata"`  // Include node metadata
}

// CreateBackup starts an asynchronous backup job
// @Method POST
// @Description Start a new backup job with specified options. Returns a job ID for tracking progress.
// @Router /backup [post]
func (ctr *Controller) CreateBackup(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Parse request body for options
	var req CreateBackupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// If no body provided, use default options
		req = CreateBackupRequest{}
	}

	// Build options from request (default to true if not specified)
	options := types.BackupOptions{
		IncludeDocuments: req.IncludeDocuments == nil || *req.IncludeDocuments,
		IncludeFiles:     req.IncludeFiles == nil || *req.IncludeFiles,
		IncludeSettings:  req.IncludeSettings == nil || *req.IncludeSettings,
		IncludeMetadata:  req.IncludeMetadata == nil || *req.IncludeMetadata,
	}

	// Start async backup
	jobId, err := ctr.app.Services.Backup.CreateBackupAsync(userId, options, ctr.app.MinioClient)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusAccepted, gin.H{
		"job_id": jobId, // Return the job ID to the client for tracking
	}
}

// GetBackupStatus returns the current status of a backup job
// @Method GET
// @Description Get the status of an ongoing or completed backup job.
// @Router /backup/:jobId [get]
func (ctr *Controller) GetBackupStatus(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	jobId := c.Param("jobId")
	if jobId == "" {
		return http.StatusBadRequest, errors.New("job ID is required")
	}

	job, err := ctr.app.Services.Backup.GetBackupStatus(userId, jobId)
	if err != nil {
		return http.StatusNotFound, err
	}

	return http.StatusOK, job
}

// CancelBackup cancels an ongoing backup job
// @Method DELETE
// @Description Cancel an ongoing backup job.
// @Router /backup/:jobId [delete]
func (ctr *Controller) CancelBackup(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	jobId := c.Param("jobId")
	if jobId == "" {
		return http.StatusBadRequest, errors.New("job ID is required")
	}

	err = ctr.app.Services.Backup.CancelBackup(userId, jobId)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, gin.H{
		"message": "Backup job cancelled successfully",
	}
}
