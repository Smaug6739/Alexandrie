package models

import "alexandrie/types"

type Node struct {
	Id               types.Snowflake  `json:"id" form:"id" binding:"omitempty"`
	UserId           types.Snowflake  `json:"user_id" form:"user_id" binding:"omitempty"`
	Role             int              `json:"role" form:"role" binding:"required"`
	Icon             *string          `json:"icon" form:"icon" binding:"omitempty"`
	Color            *int             `json:"color" form:"color" binding:"omitempty"`
	ParentId         *types.Snowflake `json:"parent_id" form:"parent_id" binding:"omitempty"`
	CreatedTimestamp int64            `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
	UpdatedTimestamp int64            `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty"`
}
