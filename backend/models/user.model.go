package models

import "alexandrie/types"

type User struct {
	Id               types.Snowflake `json:"id" form:"id" binding:"omitempty" db:"id"`
	Username         string          `json:"username" form:"username" binding:"required,min=5,max=30" db:"username"`
	Firstname        *string         `json:"firstname" form:"firstname" binding:"omitempty" db:"firstname"`
	Lastname         *string         `json:"lastname" form:"lastname" binding:"omitempty" db:"lastname"`
	Role             int             `json:"role" form:"role" binding:"omitempty" db:"role"` // 1: user, 2: admin
	Type             int             `json:"type" form:"type" binding:"omitempty" db:"type"` // 0: Regular user, 1: Supervised account
	Avatar           *string         `json:"avatar" form:"avatar" binding:"omitempty" db:"avatar"`
	Email            *string         `json:"email" form:"email" binding:"omitempty,email" db:"email"`
	Password         *string         `json:"password,omitempty" form:"password" binding:"omitempty,min=4,max=50" db:"password"`
	TotpSecret       *string         `json:"-" db:"totp_secret"`
	TotpEnabled      bool            `json:"totp_enabled" db:"totp_enabled"`
	TOTPForced       bool            `json:"totp_forced" db:"totp_forced"`
	Suspended        bool            `json:"suspended" db:"suspended"`
	CreatedTimestamp int64           `json:"created_timestamp" form:"created_timestamp" binding:"omitempty" db:"created_timestamp"`
	UpdatedTimestamp int64           `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty" db:"updated_timestamp"`
}
