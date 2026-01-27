package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
)

type SessionService interface {
	GetSessionsByUserId(userId types.Snowflake) ([]models.Session, error)
	DeleteOldSessions() error
}

type sessionService struct {
	sessionRepo repositories.SessionRepository
}

func NewSessionService(sessionRepo repositories.SessionRepository) SessionService {
	return &sessionService{
		sessionRepo: sessionRepo,
	}
}

func (s *sessionService) GetSessionsByUserId(userId types.Snowflake) ([]models.Session, error) {
	return s.sessionRepo.GetByUserId(userId)
}

func (s *sessionService) DeleteOldSessions() error {
	return s.sessionRepo.DeleteOld()
}
