package models

import "alexandrie/types"

type Log struct {
	Id        types.Snowflake `json:"id"`
	UserId    types.Snowflake `json:"user_id"`
	IpAddr    string          `json:"ip_address"`
	UserAgent string          `json:"user_agent"`
	Location  string          `json:"location"`
	Type      string          `json:"type"`
	Timestamp int64           `json:"timestamp"`
}
