package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"
)

// OIDCProviderRepositoryImpl implements the OIDCProviderRepository interface
type OIDCProviderRepositoryImpl struct {
	db      *sql.DB
	manager *RepositoryManager
}

type OIDCProviderRepository interface {
	GetByUserID(userID types.Snowflake) ([]*models.UserOIDCProvider, error)
	GetByProviderAndSubject(providerName, providerUserID string) (*models.UserOIDCProvider, error)
	Create(link *models.UserOIDCProvider) (*models.UserOIDCProvider, error)
	Delete(id types.Snowflake) error
	DeleteByUserID(userID types.Snowflake) error
}

// Prepared statement keys
const (
	stmtOIDCGetByUserID             = "oidc_get_by_user_id"
	stmtOIDCGetByProviderAndSubject = "oidc_get_by_provider_and_subject"
	stmtOIDCCreate                  = "oidc_create"
	stmtOIDCDelete                  = "oidc_delete"
	stmtOIDCDeleteByUserID          = "oidc_delete_by_user_id"
)

// NewOIDCProviderRepository creates a new OIDC provider repository with prepared statements
func NewOIDCProviderRepository(db *sql.DB, manager *RepositoryManager) (OIDCProviderRepository, error) {
	repo := &OIDCProviderRepositoryImpl{
		db:      db,
		manager: manager,
	}

	if err := repo.prepareStatements(); err != nil {
		return nil, fmt.Errorf("failed to prepare OIDC provider statements: %w", err)
	}

	return repo, nil
}

// prepareStatements prepares all SQL statements for the OIDC provider repository
func (r *OIDCProviderRepositoryImpl) prepareStatements() error {
	statements := map[string]string{
		stmtOIDCGetByUserID: `
			SELECT id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp
			FROM user_oidc_providers
			WHERE user_id = ?`,

		stmtOIDCGetByProviderAndSubject: `
			SELECT id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp
			FROM user_oidc_providers
			WHERE provider_name = ? AND provider_user_id = ?`,

		stmtOIDCCreate: `
			INSERT INTO user_oidc_providers (id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp)
			VALUES (?, ?, ?, ?, ?, ?)`,

		stmtOIDCDelete: `
			DELETE FROM user_oidc_providers
			WHERE id = ?`,

		stmtOIDCDeleteByUserID: `
			DELETE FROM user_oidc_providers
			WHERE user_id = ?`,
	}

	for key, query := range statements {
		if _, err := r.manager.PrepareStatement(key, query); err != nil {
			return err
		}
	}

	return nil
}

// GetByUserID retrieves all OIDC provider links for a user
func (r *OIDCProviderRepositoryImpl) GetByUserID(userID types.Snowflake) ([]*models.UserOIDCProvider, error) {
	stmt, err := r.manager.GetStatement(stmtOIDCGetByUserID)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query OIDC providers for user: %w", err)
	}
	defer rows.Close()

	links := make([]*models.UserOIDCProvider, 0)
	for rows.Next() {
		var link models.UserOIDCProvider
		err := rows.Scan(
			&link.Id,
			&link.UserId,
			&link.ProviderName,
			&link.ProviderUserId,
			&link.CreatedTimestamp,
			&link.UpdatedTimestamp,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan OIDC provider link: %w", err)
		}
		links = append(links, &link)
	}

	return links, nil
}

// GetByProviderAndSubject finds a link by provider name and provider user ID
func (r *OIDCProviderRepositoryImpl) GetByProviderAndSubject(providerName, providerUserID string) (*models.UserOIDCProvider, error) {
	stmt, err := r.manager.GetStatement(stmtOIDCGetByProviderAndSubject)
	if err != nil {
		return nil, err
	}

	var link models.UserOIDCProvider
	err = stmt.QueryRow(providerName, providerUserID).Scan(
		&link.Id,
		&link.UserId,
		&link.ProviderName,
		&link.ProviderUserId,
		&link.CreatedTimestamp,
		&link.UpdatedTimestamp,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get OIDC provider link: %w", err)
	}

	return &link, nil
}

// Create creates a new user-OIDC provider link
func (r *OIDCProviderRepositoryImpl) Create(link *models.UserOIDCProvider) (*models.UserOIDCProvider, error) {
	stmt, err := r.manager.GetStatement(stmtOIDCCreate)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(
		link.Id,
		link.UserId,
		link.ProviderName,
		link.ProviderUserId,
		link.CreatedTimestamp,
		link.UpdatedTimestamp,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create OIDC provider link: %w", err)
	}

	return link, nil
}

// Delete removes a user-OIDC provider link
func (r *OIDCProviderRepositoryImpl) Delete(id types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtOIDCDelete)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		return fmt.Errorf("failed to delete OIDC provider link: %w", err)
	}

	return nil
}

// DeleteByUserID removes all OIDC provider links for a user
func (r *OIDCProviderRepositoryImpl) DeleteByUserID(userID types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtOIDCDeleteByUserID)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(userID)
	if err != nil {
		return fmt.Errorf("failed to delete OIDC provider links for user: %w", err)
	}

	return nil
}
