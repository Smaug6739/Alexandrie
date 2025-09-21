package models

import "alexandrie/types"

type Permission struct {
	Id               types.Snowflake `json:"id" form:"id" binding:"omitempty"`
	NodeId           types.Snowflake `json:"node_id" form:"node_id"`
	UserId           types.Snowflake `json:"user_id" form:"user_id"`
	Permission       int             `json:"permission" form:"permission"`
	CreatedTimestamp int64           `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
}
