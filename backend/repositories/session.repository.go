package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"
	"time"
)

// SessionRepositoryImpl implements the SessionRepository interface with prepared statements
type SessionRepositoryImpl struct {
	db      *sql.DB
	manager *RepositoryManager
}

// SessionRepository defines the interface for session data access operations
type SessionRepository interface {
	GetByRefreshToken(refreshToken string) (*models.Session, error)
	Create(session *models.Session) (*models.Session, error)
	Update(session *models.Session) (*models.Session, error)
	Delete(sessionId types.Snowflake) error
	DeleteAllByUser(userId types.Snowflake) error
	DeleteOld() error
}

// Prepared statement keys
const (
	stmtSessionGetByRefreshToken = "session_get_by_refresh_token"
	stmtSessionCreate            = "session_create"
	stmtSessionUpdate            = "session_update"
	stmtSessionDelete            = "session_delete"
	stmtSessionDeleteAllByUser   = "session_delete_all_by_user"
	stmtSessionDeleteOld         = "session_delete_old"
)

// NewSessionRepository creates a new session repository with prepared statements
func NewSessionRepository(db *sql.DB, manager *RepositoryManager) (SessionRepository, error) {
	repo := &SessionRepositoryImpl{
		db:      db,
		manager: manager,
	}

	if err := repo.prepareStatements(); err != nil {
		return nil, fmt.Errorf("failed to prepare session statements: %w", err)
	}

	return repo, nil
}

// prepareStatements prepares all SQL statements for the session repository
func (r *SessionRepositoryImpl) prepareStatements() error {
	statements := map[string]string{
		stmtSessionGetByRefreshToken: `
			SELECT id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, login_timestamp, logout_timestamp
			FROM sessions
			WHERE refresh_token = ? AND active = 1`,

		stmtSessionCreate: `
			INSERT INTO sessions (id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, login_timestamp, logout_timestamp)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

		stmtSessionUpdate: `
			UPDATE sessions
			SET refresh_token = ?, expire_token = ?, last_refresh_timestamp = ?
			WHERE id = ?`,

		stmtSessionDelete: `
			DELETE FROM sessions
			WHERE id = ?`,

		stmtSessionDeleteAllByUser: `
			DELETE FROM sessions
			WHERE user_id = ?`,

		stmtSessionDeleteOld: `
			DELETE FROM sessions
			WHERE expire_token < ?`,
	}

	// Prepare all statements
	for key, query := range statements {
		if _, err := r.manager.PrepareStatement(key, query); err != nil {
			return err
		}
	}

	return nil
}

// GetByRefreshToken retrieves a session by refresh token
func (r *SessionRepositoryImpl) GetByRefreshToken(refreshToken string) (*models.Session, error) {
	stmt, err := r.manager.GetStatement(stmtSessionGetByRefreshToken)
	if err != nil {
		return nil, err
	}

	var session models.Session
	err = stmt.QueryRow(refreshToken).Scan(
		&session.Id,
		&session.UserId,
		&session.RefreshToken,
		&session.ExpireToken,
		&session.LastRefreshTimestamp,
		&session.Active,
		&session.LoginTimestamp,
		&session.LogoutTimestamp,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get session by refresh token: %w", err)
	}

	return &session, nil
}

// Create creates a new session
func (r *SessionRepositoryImpl) Create(session *models.Session) (*models.Session, error) {
	stmt, err := r.manager.GetStatement(stmtSessionCreate)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(
		session.Id,
		session.UserId,
		session.RefreshToken,
		session.ExpireToken,
		session.LastRefreshTimestamp,
		session.Active,
		session.LoginTimestamp,
		session.LogoutTimestamp,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return session, nil
}

// Update updates an existing session
func (r *SessionRepositoryImpl) Update(session *models.Session) (*models.Session, error) {
	stmt, err := r.manager.GetStatement(stmtSessionUpdate)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(
		session.RefreshToken,
		session.ExpireToken,
		session.LastRefreshTimestamp,
		session.Id,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update session: %w", err)
	}

	return session, nil
}

// Delete deletes a session
func (r *SessionRepositoryImpl) Delete(sessionId types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtSessionDelete)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(sessionId)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	return nil
}

// DeleteAllByUser deletes all sessions for a user
func (r *SessionRepositoryImpl) DeleteAllByUser(userId types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtSessionDeleteAllByUser)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(userId)
	if err != nil {
		return fmt.Errorf("failed to delete all user sessions: %w", err)
	}

	return nil
}

// DeleteOld deletes expired sessions
func (r *SessionRepositoryImpl) DeleteOld() error {
	stmt, err := r.manager.GetStatement(stmtSessionDeleteOld)
	if err != nil {
		return err
	}

	currentTime := time.Now().UnixMilli()
	_, err = stmt.Exec(currentTime)
	if err != nil {
		return fmt.Errorf("failed to delete old sessions: %w", err)
	}

	return nil
}
