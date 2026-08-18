package services

import (
	"alexandrie/models"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"errors"
	"time"
)

type CalendarEventService interface {
	GetEvents(userID types.Snowflake) ([]*models.CalendarEvent, error)
	GetEvent(id types.Snowflake, userID types.Snowflake) (*models.CalendarEvent, error)
	CreateEvent(userID types.Snowflake, event *models.CalendarEvent) (*models.CalendarEvent, error)
	UpdateEvent(userID types.Snowflake, event *models.CalendarEvent) (*models.CalendarEvent, error)
	DeleteEvent(id types.Snowflake, userID types.Snowflake) error
}

type calendarEventService struct {
	repos     *repositories.RepositoryManager
	snowflake *snowflake.Snowflake
}

func NewCalendarEventService(repos *repositories.RepositoryManager, sf *snowflake.Snowflake) CalendarEventService {
	return &calendarEventService{
		repos:     repos,
		snowflake: sf,
	}
}

func (s *calendarEventService) GetEvents(userID types.Snowflake) ([]*models.CalendarEvent, error) {
	return s.repos.CalendarEvent.GetByUserID(userID)
}

func (s *calendarEventService) GetEvent(id types.Snowflake, userID types.Snowflake) (*models.CalendarEvent, error) {
	event, err := s.repos.CalendarEvent.GetByID(id)
	if err != nil {
		return nil, err
	}
	if event == nil || event.UserId != userID {
		return nil, errors.New("event not found or not authorized")
	}
	return event, nil
}

func (s *calendarEventService) CreateEvent(userID types.Snowflake, event *models.CalendarEvent) (*models.CalendarEvent, error) {
	now := time.Now().UnixNano() / int64(time.Millisecond)
	event.Id = s.snowflake.Generate()
	event.UserId = userID
	event.CreatedTimestamp = now
	event.UpdatedTimestamp = now

	err := s.repos.CalendarEvent.Create(event)
	if err != nil {
		return nil, err
	}	return event, nil
}

func (s *calendarEventService) UpdateEvent(userID types.Snowflake, event *models.CalendarEvent) (*models.CalendarEvent, error) {
	existing, err := s.repos.CalendarEvent.GetByID(event.Id)
	if err != nil {
		return nil, err
	}
	if existing == nil || existing.UserId != userID {
		return nil, errors.New("event not found or not authorized")
	}

	now := time.Now().UnixNano() / int64(time.Millisecond)
	event.UserId = userID
	event.CreatedTimestamp = existing.CreatedTimestamp
	event.UpdatedTimestamp = now

	err = s.repos.CalendarEvent.Update(event)
	if err != nil {
		return nil, err
	}
	return event, nil
}

func (s *calendarEventService) DeleteEvent(id types.Snowflake, userID types.Snowflake) error {
	existing, err := s.repos.CalendarEvent.GetByID(id)
	if err != nil {
		return err
	}
	if existing == nil || existing.UserId != userID {
		return errors.New("event not found or not authorized")
	}

	return s.repos.CalendarEvent.Delete(id)
}
