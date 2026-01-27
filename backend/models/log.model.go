package models

import "alexandrie/types"

type Log struct {
	Id        types.Snowflake `json:"id" db:"id"`
	UserId    types.Snowflake `json:"user_id" db:"user_id"`
	IpAddr    string          `json:"ip_address" db:"ip_adress"`
	UserAgent string          `json:"user_agent" db:"user_agent"`
	Location  string          `json:"location" db:"location"`
	Type      string          `json:"type" db:"type"`
	Timestamp int64           `json:"timestamp" db:"timestamp"`
}
