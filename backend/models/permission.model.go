package models

import "alexandrie/types"

type Permission struct {
	Id               types.Snowflake `json:"id" form:"id" binding:"omitempty" db:"id"`
	NodeId           types.Snowflake `json:"node_id" form:"node_id" binding:"omitempty" db:"node_id"`
	UserId           types.Snowflake `json:"user_id" form:"user_id" db:"user_id"`
	Permission       int             `json:"permission" form:"permission" db:"permission"`
	CreatedTimestamp int64           `json:"created_timestamp" form:"created_timestamp" binding:"omitempty" db:"created_timestamp"`
}
