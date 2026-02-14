package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type OIDCProviderRepositoryImpl struct {
	db *sqlx.DB
}

type OIDCProviderRepository interface {
	GetByUserID(userID types.Snowflake) ([]*models.UserOIDCProvider, error)
	GetByProviderAndSubject(providerName, providerUserID string) (*models.UserOIDCProvider, error)
	Create(link *models.UserOIDCProvider) (*models.UserOIDCProvider, error)
	Delete(id types.Snowflake) error
	DeleteByUserID(userID types.Snowflake) error
}

func NewOIDCProviderRepository(db *sqlx.DB) OIDCProviderRepository {
	return &OIDCProviderRepositoryImpl{db: db}
}

// GetByUserID retrieves all OIDC provider links for a user
func (r *OIDCProviderRepositoryImpl) GetByUserID(userID types.Snowflake) ([]*models.UserOIDCProvider, error) {
	var links []*models.UserOIDCProvider
	err := r.db.Select(&links, `
		SELECT id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp
		FROM user_oidc_providers
		WHERE user_id = ?`, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query OIDC providers for user: %w", err)
	}
	return links, nil
}

// GetByProviderAndSubject finds a link by provider name and provider user ID
func (r *OIDCProviderRepositoryImpl) GetByProviderAndSubject(providerName, providerUserID string) (*models.UserOIDCProvider, error) {
	var link models.UserOIDCProvider
	err := r.db.Get(&link, `
		SELECT id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp
		FROM user_oidc_providers
		WHERE provider_name = ? AND provider_user_id = ?`, providerName, providerUserID)
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
	_, err := r.db.NamedExec(`
		INSERT INTO user_oidc_providers (id, user_id, provider_name, provider_user_id, created_timestamp, updated_timestamp)
		VALUES (:id, :user_id, :provider_name, :provider_user_id, :created_timestamp, :updated_timestamp)`, link)
	if err != nil {
		return nil, fmt.Errorf("failed to create OIDC provider link: %w", err)
	}
	return link, nil
}

// Delete removes a user-OIDC provider link
func (r *OIDCProviderRepositoryImpl) Delete(id types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM user_oidc_providers WHERE id = ?`, id)
	if err != nil {
		return fmt.Errorf("failed to delete OIDC provider link: %w", err)
	}
	return nil
}

// DeleteByUserID removes all OIDC provider links for a user
func (r *OIDCProviderRepositoryImpl) DeleteByUserID(userID types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM user_oidc_providers WHERE user_id = ?`, userID)
	if err != nil {
		return fmt.Errorf("failed to delete OIDC provider links for user: %w", err)
	}
	return nil
}
