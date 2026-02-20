package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
)

type UserSettingsService interface {
	GetSettings(userID types.Snowflake) (*models.UserSettings, error)
	SaveSettings(settings *models.UserSettings) error
}

type userSettingsService struct {
	settingsRepo repositories.UserSettingsRepository
}

func NewUserSettingsService(settingsRepo repositories.UserSettingsRepository) UserSettingsService {
	return &userSettingsService{
		settingsRepo: settingsRepo,
	}
}

// GetSettings returns the user settings, or an empty shell if none exist yet
func (s *userSettingsService) GetSettings(userID types.Snowflake) (*models.UserSettings, error) {
	settings, err := s.settingsRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if settings == nil {
		// Return empty settings — the frontend will merge with its defaults
		return &models.UserSettings{
			UserID:   userID,
			General:  types.JSONB{},
			Editor:   types.JSONB{},
			Advanced: types.JSONB{},
		}, nil
	}
	return settings, nil
}

// SaveSettings persists user settings (upsert)
func (s *userSettingsService) SaveSettings(settings *models.UserSettings) error {
	return s.settingsRepo.Upsert(settings)
}
