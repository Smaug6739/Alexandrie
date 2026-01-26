package models

import "alexandrie/types"

// UserOIDCProvider represents a link between a user and an external OIDC provider
type UserOIDCProvider struct {
	Id               types.Snowflake `json:"id"`
	UserId           types.Snowflake `json:"user_id"`
	ProviderName     string          `json:"provider_name"`
	ProviderUserId   string          `json:"provider_user_id"`
	CreatedTimestamp int64           `json:"created_timestamp"`
	UpdatedTimestamp int64           `json:"updated_timestamp"`
}
