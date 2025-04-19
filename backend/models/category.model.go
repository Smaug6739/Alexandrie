package models

import "alexandrie/types"

type Category struct {
	Id          types.Snowflake  `json:"id" form:"id" binding:"omitempty"`
	Name        string           `json:"name" form:"name" binding:"required,max=50"`
	Icon        string           `json:"icon" form:"icon" binding:"omitempty,max=30000"`
	Order       int              `json:"order" form:"order" binding:"omitempty"`
	Role        int              `json:"role" form:"role" binding:"omitempty"` // 0 category; 1 workspace;
	WorkspaceId *types.Snowflake `json:"workspace_id" form:"workspace_id" binding:"omitempty"`
	ParentId    *types.Snowflake `json:"parent_id" form:"parent_id" binding:"omitempty"`
	AuthorId    types.Snowflake  `json:"author_id" form:"author_id" binding:"omitempty"`
}
