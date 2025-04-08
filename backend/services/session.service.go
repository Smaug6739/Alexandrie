package services

import (
	"Smaug6739/Alexandrie/models"
	"database/sql"
	"time"
)

type AuthService interface {
	CreateSession(session *models.Session) (*models.Session, error)
	GetSession(refreshToken string) (models.Session, error)
	UpdateSession(session *models.Session) (*models.Session, error)
	DeleteOldSessions() error
}

func NewAuthService(db *sql.DB) AuthService {
	return &Service{db: db}
}

func (s *Service) CreateSession(session *models.Session) (*models.Session, error) {
	_, err := s.db.Exec("INSERT INTO sessions (id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, login_timestamp, logout_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		session.Id, session.UserId, session.RefreshToken, session.ExpireToken, session.LastRefreshTimestamp, session.Active, session.LoginTimestamp, session.LogoutTimestamp)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (s *Service) GetSession(refreshToken string) (models.Session, error) {
	var session models.Session
	s.db.QueryRow("SELECT * FROM sessions WHERE refresh_token = ?", refreshToken).Scan(
		&session.Id, &session.UserId, &session.RefreshToken, &session.ExpireToken, &session.LastRefreshTimestamp, &session.Active, &session.LoginTimestamp, &session.LogoutTimestamp,
	)
	return session, nil
}

func (s *Service) UpdateSession(session *models.Session) (*models.Session, error) {
	_, err := s.db.Exec("UPDATE sessions SET refresh_token = ?, expire_token = ?, last_refresh_timestamp = ?, active = ?, login_timestamp = ?, logout_timestamp = ? WHERE id = ?",
		session.RefreshToken, session.ExpireToken, session.LastRefreshTimestamp, session.Active, session.LoginTimestamp, session.LogoutTimestamp, session.Id)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (s *Service) DeleteOldSessions() error {
	_, err := s.db.Exec("DELETE FROM sessions WHERE expire_token < ? OR active = 0", time.Now().UnixMilli())
	if err != nil {
		return err
	}
	return nil
}
