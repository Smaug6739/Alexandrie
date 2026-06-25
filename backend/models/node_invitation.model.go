package models

import "alexandrie/types"

type NodeInvitation struct {
	Id               types.Snowflake `json:"id" db:"id"`
	InvitationCode   string          `json:"invitation_code" db:"invitation_code"`
	PermissionLevel  int             `json:"permission_level" db:"permission_level"`
	NodeId           types.Snowflake `json:"node_id" db:"node_id"`
	CreatedTimestamp int64           `json:"created_timestamp" db:"created_timestamp"`
}
