package services

import (
	"alexandrie/models"
	"alexandrie/pkg/logger"
	"alexandrie/repositories"
	"alexandrie/types"
	"time"
)

type SessionService interface {
	GetSessionsByUserId(userId types.Snowflake) ([]models.Session, error)
	DeleteOldSessions()
}

type sessionService struct {
	sessionRepo repositories.SessionRepository
}

func NewSessionService(sessionRepo repositories.SessionRepository) SessionService {
	s := &sessionService{
		sessionRepo: sessionRepo,
	}
	go func() {
		for {
			s.DeleteOldSessions()
			time.Sleep(1 * time.Hour)
		}
	}()
	return s
}

func (s *sessionService) GetSessionsByUserId(userId types.Snowflake) ([]models.Session, error) {
	return s.sessionRepo.GetByUserId(userId)
}

func (s *sessionService) DeleteOldSessions() {
	err := s.sessionRepo.DeleteOld()
	if err != nil {
		logger.Error("session", "Error during automatic deletion: "+err.Error())
	} else {
		logger.Success("session", "Old sessions deleted successfully.")
	}
}
