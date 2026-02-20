package models

import "alexandrie/types"

type UserSettings struct {
	UserID   types.Snowflake `json:"user_id" db:"user_id"`
	General  types.JSONB     `json:"general" db:"general"`
	Editor   types.JSONB     `json:"editor" db:"editor"`
	Advanced types.JSONB     `json:"advanced" db:"advanced"`
}
