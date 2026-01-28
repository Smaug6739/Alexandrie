package models

import "alexandrie/types"

type Session struct {
	Id                   types.Snowflake `json:"id" db:"id"`
	UserId               types.Snowflake `json:"user_id" db:"user_id"`
	RefreshToken         string          `json:"refresh_token" db:"refresh_token"`
	ExpireToken          int64           `json:"expire_token" db:"expire_token"`
	LastRefreshTimestamp int64           `json:"last_refresh_timestamp" db:"last_refresh_timestamp"`
	Active               int             `json:"active" db:"active"` // 0: No; 1: Yes;
	IpAddr               *string         `json:"ip_adress" db:"ip_adress"`
	UserAgent            *string         `json:"user_agent" db:"user_agent"`
	Location             *string         `json:"location" db:"location"`
	Type                 *string         `json:"type" db:"type"`
	LoginTimestamp       int64           `json:"login_timestamp" db:"login_timestamp"`
	LogoutTimestamp      int64           `json:"logout_timestamp" db:"logout_timestamp"`
}
