package services

import (
	"alexandrie/models"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"time"
)

type LogService interface {
	GetConnections(userId types.Snowflake) ([]*models.Log, error)
	GetLastConnection(userId types.Snowflake) (*models.Log, error)
	CreateConnectionLog(userId types.Snowflake, ipAddr, userAgent, location, logType string) error
	DeleteOldLogs() error
}

type logService struct {
	logRepo   repositories.LogRepository
	snowflake *snowflake.Snowflake
}

func NewLogService(logRepo repositories.LogRepository, snowflake *snowflake.Snowflake) LogService {
	return &logService{
		logRepo:   logRepo,
		snowflake: snowflake,
	}
}

func (s *logService) GetConnections(userId types.Snowflake) ([]*models.Log, error) {
	return s.logRepo.GetByUserID(userId)
}

func (s *logService) GetLastConnection(userId types.Snowflake) (*models.Log, error) {
	return s.logRepo.GetLastByUserID(userId)
}

func (s *logService) CreateConnectionLog(userId types.Snowflake, ipAddr, userAgent, location, logType string) error {
	log := &models.Log{
		Id:        s.snowflake.Generate(),
		UserId:    userId,
		IpAddr:    ipAddr,
		UserAgent: userAgent,
		Location:  location,
		Type:      logType,
		Timestamp: time.Now().UnixMilli(),
	}
	return s.logRepo.Create(log)
}

func (s *logService) DeleteOldLogs() error {
	return s.logRepo.DeleteOld()
}
