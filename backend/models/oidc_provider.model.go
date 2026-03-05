package models

import "alexandrie/types"

type UserOIDCProvider struct {
	Id               types.Snowflake `json:"id" db:"id"`
	UserId           types.Snowflake `json:"user_id" db:"user_id"`
	ProviderName     string          `json:"provider_name" db:"provider_name"`
	ProviderUserId   string          `json:"provider_user_id" db:"provider_user_id"`
	CreatedTimestamp int64           `json:"created_timestamp" db:"created_timestamp"`
	UpdatedTimestamp int64           `json:"updated_timestamp" db:"updated_timestamp"`
}
