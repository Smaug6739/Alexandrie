package models

import "alexandrie/types"

type CalendarEvent struct {
	Id               types.Snowflake  `json:"id" form:"id" binding:"omitempty" db:"id"`
	UserId           types.Snowflake  `json:"user_id" form:"user_id" binding:"omitempty" db:"user_id"`
	Title            string           `json:"title" form:"title" binding:"required,max=255" db:"title"`
	Description      *string          `json:"description" form:"description" binding:"omitempty" db:"description"`
	StartDate        int64            `json:"start_date" form:"start_date" binding:"required" db:"start_date"`
	EndDate          int64            `json:"end_date" form:"end_date" binding:"required" db:"end_date"`
	Color            *string          `json:"color" form:"color" binding:"omitempty,max=50" db:"color"`
	Type             string           `json:"type" form:"type" binding:"required,max=50" db:"type"` // you can use "event" or "homework" or "exam" or "other"
	NodeId             *types.Snowflake `json:"node_id" form:"node_id" binding:"omitempty" db:"node_id"`
	RecurrencePattern  string           `json:"recurrence_pattern" form:"recurrence_pattern" db:"recurrence_pattern"`
	RecurrenceInterval int              `json:"recurrence_interval" form:"recurrence_interval" db:"recurrence_interval"`
	RecurrenceEnd      *int64           `json:"recurrence_end" form:"recurrence_end" db:"recurrence_end"`
	CreatedTimestamp   int64            `json:"created_timestamp" form:"created_timestamp" db:"created_timestamp"`
	UpdatedTimestamp   int64            `json:"updated_timestamp" form:"updated_timestamp" db:"updated_timestamp"`
}
