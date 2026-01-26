package models

import "alexandrie/types"

type User struct {
	Id               types.Snowflake `json:"id" form:"id" binding:"omitempty"`
	Username         string          `json:"username" form:"username" binding:"required,min=5,max=30"`
	Firstname        *string         `json:"firstname" form:"firstname" binding:"omitempty"`
	Lastname         *string         `json:"lastname" form:"lastname" binding:"omitempty"`
	Role             int             `json:"role" form:"role" binding:"omitempty"` // 1: user, 2: admin
	Avatar           *string         `json:"avatar" form:"avatar" binding:"omitempty"`
	Email            *string         `json:"email" form:"email" binding:"required,email"`
	Password         *string         `json:"password,omitempty" form:"password" binding:"omitempty,min=4,max=50"`
	CreatedTimestamp int64           `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
	UpdatedTimestamp int64           `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty"`
}
