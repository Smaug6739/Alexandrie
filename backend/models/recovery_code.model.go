package models

import "alexandrie/types"

type UserTOTPRecoveryCode struct {
	Id               types.Snowflake `json:"id" db:"id"`
	UserId           types.Snowflake `json:"user_id" db:"user_id"`
	Code             string          `json:"code" db:"code"`
	Used             bool            `json:"used" db:"used"`
	CreatedTimestamp int64           `json:"created_timestamp" db:"created_timestamp"`
}
