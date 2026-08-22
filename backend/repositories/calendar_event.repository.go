package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type CalendarEventRepositoryImpl struct {
	db *sqlx.DB
}

type CalendarEventRepository interface {
	GetByUserID(userID types.Snowflake) ([]*models.CalendarEvent, error)
	GetByID(id types.Snowflake) (*models.CalendarEvent, error)
	Create(event *models.CalendarEvent) error
	Update(event *models.CalendarEvent) error
	Delete(id types.Snowflake) error
}

func NewCalendarEventRepository(db *sqlx.DB) CalendarEventRepository {
	return &CalendarEventRepositoryImpl{db: db}
}

func (r *CalendarEventRepositoryImpl) GetByUserID(userID types.Snowflake) ([]*models.CalendarEvent, error) {
	events := []*models.CalendarEvent{}
	err := r.db.Select(&events, `SELECT id, user_id, title, description, start_date, end_date, color, type, node_id, recurrence_pattern, recurrence_interval, recurrence_end, created_timestamp, updated_timestamp FROM calendar_events WHERE user_id = ?`, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get calendar events for the user id: %w", err)
	}
	return events, nil
}

func (r *CalendarEventRepositoryImpl) GetByID(id types.Snowflake) (*models.CalendarEvent, error) {
	var event models.CalendarEvent
	err := r.db.Get(&event, `SELECT id, user_id, title, description, start_date, end_date, color, type, node_id, recurrence_pattern, recurrence_interval, recurrence_end, created_timestamp, updated_timestamp FROM calendar_events WHERE id = ?`, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get calendar event with the id: %w", err)
	}
	return &event, nil
}

func (r *CalendarEventRepositoryImpl) Create(event *models.CalendarEvent) error {
	_, err := r.db.NamedExec(`
		INSERT INTO calendar_events (id, user_id, title, description, start_date, end_date, color, type, node_id, recurrence_pattern, recurrence_interval, recurrence_end, created_timestamp, updated_timestamp)
		VALUES (:id, :user_id, :title, :description, :start_date, :end_date, :color, :type, :node_id, :recurrence_pattern, :recurrence_interval, :recurrence_end, :created_timestamp, :updated_timestamp)
	`, event)
	if err != nil {
		return fmt.Errorf("failed to create a calendar event: %w", err)
	}
	return nil
}

func (r *CalendarEventRepositoryImpl) Update(event *models.CalendarEvent) error {
	_, err := r.db.NamedExec(`
		UPDATE calendar_events
		SET title = :title,
		    description = :description,
		    start_date = :start_date,
		    end_date = :end_date,
		    color = :color,
		    type = :type,
		    node_id = :node_id,
		    recurrence_pattern = :recurrence_pattern,
		    recurrence_interval = :recurrence_interval,
		    recurrence_end = :recurrence_end,
		    updated_timestamp = :updated_timestamp
		WHERE id = :id AND user_id = :user_id
	`, event)
	if err != nil {
		return fmt.Errorf("failed to update calendar event: %w", err)
	}
	return nil
}

func (r *CalendarEventRepositoryImpl) Delete(id types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM calendar_events WHERE id = ?`, id)
	if err != nil {
		return fmt.Errorf("failed to delete calendar event: %w", err)
	}
	return nil
}
