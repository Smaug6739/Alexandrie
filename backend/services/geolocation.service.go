package services

import (
	"alexandrie/repositories"
)

type GeolocationService interface {
	GetLocationFromIp(ip string) string
}

type geolocationService struct {
	logRepo repositories.LogRepository
}

func NewGeolocationService(logRepo repositories.LogRepository) GeolocationService {
	return &geolocationService{
		logRepo: logRepo,
	}
}

func (s *geolocationService) GetLocationFromIp(ip string) string {
	return s.logRepo.GetLocationFromIP(ip)
}
