package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

type SessionRepositoryImpl struct {
	db *sqlx.DB
}

type SessionRepository interface {
	GetByUserId(userId types.Snowflake) ([]models.Session, error)
	GetByRefreshToken(refreshToken string) (*models.Session, error)
	Create(session *models.Session) (*models.Session, error)
	Update(session *models.Session) (*models.Session, error)
	Delete(sessionId types.Snowflake) error
	DeleteAllByUser(userId types.Snowflake) error
	DeleteOld() error
}

func NewSessionRepository(db *sqlx.DB) SessionRepository {
	return &SessionRepositoryImpl{db: db}
}

// GetByUserId retrieves all sessions for a given user ID
func (r *SessionRepositoryImpl) GetByUserId(userId types.Snowflake) ([]models.Session, error) {
	var sessions []models.Session
	err := r.db.Select(&sessions, `
			SELECT id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, ip_adress, user_agent, location, type, login_timestamp, logout_timestamp
			FROM sessions
			WHERE user_id = ?`, userId)

	if err != nil {
		return nil, fmt.Errorf("failed to get sessions by user ID: %w", err)
	}

	return sessions, nil
}

// GetByRefreshToken retrieves a session by refresh token
func (r *SessionRepositoryImpl) GetByRefreshToken(refreshToken string) (*models.Session, error) {
	var session models.Session
	err := r.db.Get(&session, `
			SELECT id, user_id, expire_token, last_refresh_timestamp, active, ip_adress, user_agent, location, type, login_timestamp, logout_timestamp
			FROM sessions
			WHERE refresh_token = ? AND active = 1`, refreshToken)

	if err != nil {
		return nil, fmt.Errorf("failed to get session by refresh token: %w", err)
	}

	return &session, nil
}

// Create creates a new session
func (r *SessionRepositoryImpl) Create(session *models.Session) (*models.Session, error) {
	_, err := r.db.NamedExec(`
		INSERT INTO sessions (id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, ip_adress, user_agent, location, type, login_timestamp, logout_timestamp)
		VALUES (:id, :user_id, :refresh_token, :expire_token, :last_refresh_timestamp, :active, :ip_adress, :user_agent, :location, :type, :login_timestamp, :logout_timestamp)`, session)

	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return session, nil
}

// Update updates an existing session (only refresh token and expiry)
func (r *SessionRepositoryImpl) Update(session *models.Session) (*models.Session, error) {
	_, err := r.db.Exec(`
			UPDATE sessions
			SET refresh_token = ?, expire_token = ?, last_refresh_timestamp = ?
			WHERE id = ?`, session.RefreshToken, session.ExpireToken, session.LastRefreshTimestamp, session.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to update session: %w", err)
	}

	return session, nil
}

// Delete deletes a session
func (r *SessionRepositoryImpl) Delete(sessionId types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM sessions WHERE id = ?`, sessionId)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	return nil
}

// DeleteAllByUser deletes all sessions for a user
func (r *SessionRepositoryImpl) DeleteAllByUser(userId types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM sessions WHERE user_id = ?`, userId)
	if err != nil {
		return fmt.Errorf("failed to delete all user sessions: %w", err)
	}
	return nil
}

// DeleteOld deletes expired sessions
func (r *SessionRepositoryImpl) DeleteOld() error {
	currentTime := time.Now().UnixMilli()
	_, err := r.db.Exec(`DELETE FROM sessions WHERE expire_token < ?`, currentTime)
	if err != nil {
		return fmt.Errorf("failed to delete old sessions: %w", err)
	}
	return nil
}
