package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type UserSettingsRepositoryImpl struct {
	db *sqlx.DB
}

type UserSettingsRepository interface {
	GetByUserID(userID types.Snowflake) (*models.UserSettings, error)
	Upsert(settings *models.UserSettings) error
}

func NewUserSettingsRepository(db *sqlx.DB) UserSettingsRepository {
	return &UserSettingsRepositoryImpl{db: db}
}

// GetByUserID retrieves the settings for a given user, or nil if none exist
func (r *UserSettingsRepositoryImpl) GetByUserID(userID types.Snowflake) (*models.UserSettings, error) {
	var settings models.UserSettings
	err := r.db.Get(&settings, `SELECT user_id, general, editor, advanced FROM user_settings WHERE user_id = ?`, userID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user settings: %w", err)
	}
	return &settings, nil
}

// Upsert inserts or updates user settings (MySQL ON DUPLICATE KEY UPDATE)
func (r *UserSettingsRepositoryImpl) Upsert(settings *models.UserSettings) error {
	_, err := r.db.NamedExec(`
		INSERT INTO user_settings (user_id, general, editor, advanced)
		VALUES (:user_id, :general, :editor, :advanced)
		ON DUPLICATE KEY UPDATE
			general = VALUES(general),
			editor = VALUES(editor),
			advanced = VALUES(advanced)
	`, settings)
	if err != nil {
		return fmt.Errorf("failed to upsert user settings: %w", err)
	}
	return nil
}
