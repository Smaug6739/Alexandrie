package models

import "alexandrie/types"

type Node struct {
	// Node
	Id               types.Snowflake  `json:"id" form:"id" binding:"omitempty"`
	UserId           types.Snowflake  `json:"user_id" form:"user_id" binding:"omitempty"`
	ParentId         *types.Snowflake `json:"parent_id" form:"parent_id" binding:"omitempty"`
	Name             string           `json:"name" form:"name" binding:"required,max=50"`
	Description      *string          `json:"description" form:"description" binding:"omitempty,max=250"`
	Tags             *string          `json:"tags" form:"tags" binding:"omitempty,max=250"`
	Role             int              `json:"role" form:"role" binding:"omitempty"`
	Color            *int             `json:"color" form:"color" binding:"omitempty"`
	Icon             *string          `json:"icon" form:"icon" binding:"omitempty"`
	Thumbnail        *string          `json:"thumbnail" form:"thumbnail" binding:"omitempty"`
	Theme            *string          `json:"theme" form:"theme" binding:"omitempty"`
	Accessibility    *int             `json:"accessibility" form:"accessibility" binding:"omitempty"` // 0: Public; 1: Private; 2: Unlisted;
	Access           int              `json:"access" form:"access" binding:"omitempty"`               // Bit field for access control (0: restricted, 1 view, 2 edit)
	Display          *int             `json:"display" form:"display" binding:"omitempty"`
	Order            *int             `json:"order" form:"order" binding:"omitempty"` // -1 for pinned and -2 for bookmark
	Content          *string          `json:"content" form:"content"`
	ContentCompiled  *string          `json:"content_compiled" form:"content_compiled"`
	Size             *int64           `json:"size" form:"size" binding:"omitempty"`
	Metadata         *types.JSONB     `json:"metadata" form:"metadata"`
	CreatedTimestamp int64            `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
	UpdatedTimestamp int64            `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty"`

	// Relations
	Permissions []*Permission `json:"permissions" form:"permissions" binding:"omitempty"`
}

// NodeSearchResult represents a search result with relevance score and content snippet
type NodeSearchResult struct {
	Id               types.Snowflake  `json:"id"`
	UserId           types.Snowflake  `json:"user_id"`
	ParentId         *types.Snowflake `json:"parent_id"`
	Name             string           `json:"name"`
	Description      *string          `json:"description"`
	Tags             *string          `json:"tags"`
	Role             int              `json:"role"`
	Icon             *string          `json:"icon"`
	Relevance        float64          `json:"relevance"`
	ContentSnippet   *string          `json:"content_snippet,omitempty"`
	UpdatedTimestamp int64            `json:"updated_timestamp"`
}
