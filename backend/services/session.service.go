package services

import (
	"alexandrie/repositories"
)

type SessionService interface {
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

func (s *sessionService) DeleteOldSessions() error {
	return s.sessionRepo.DeleteOld()
}
