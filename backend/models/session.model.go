package models

import "alexandrie/types"

type Session struct {
	Id                   types.Snowflake `json:"id"`
	UserId               types.Snowflake `json:"user_id"`
	RefreshToken         string          `json:"refresh_token"`
	ExpireToken          int64           `json:"expire_token"`
	LastRefreshTimestamp int64           `json:"last_refresh_timestamp"`
	Active               int             `json:"active"` // 0: No; 1: Yes;
	LoginTimestamp       int64           `json:"login_timestamp"`
	LogoutTimestamp      int64           `json:"logout_timestamp"`
}
