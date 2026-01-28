package models

import "alexandrie/types"

type Node struct {
	// Node
	Id               types.Snowflake  `json:"id" form:"id" binding:"omitempty" db:"id"`
	UserId           types.Snowflake  `json:"user_id" form:"user_id" binding:"omitempty" db:"user_id"`
	ParentId         *types.Snowflake `json:"parent_id" form:"parent_id" binding:"omitempty" db:"parent_id"`
	Name             string           `json:"name" form:"name" binding:"required,max=50" db:"name"`
	Description      *string          `json:"description" form:"description" binding:"omitempty,max=250" db:"description"`
	Tags             *string          `json:"tags" form:"tags" binding:"omitempty,max=250" db:"tags"`
	Role             int              `json:"role" form:"role" binding:"omitempty" db:"role"`
	Color            *int             `json:"color" form:"color" binding:"omitempty" db:"color"`
	Icon             *string          `json:"icon" form:"icon" binding:"omitempty" db:"icon"`
	Thumbnail        *string          `json:"thumbnail" form:"thumbnail" binding:"omitempty" db:"thumbnail"`
	Theme            *string          `json:"theme" form:"theme" binding:"omitempty" db:"theme"`
	Accessibility    *int             `json:"accessibility" form:"accessibility" binding:"omitempty" db:"accessibility"` // 0: Public; 1: Private; 2: Unlisted;
	Access           int              `json:"access" form:"access" binding:"omitempty" db:"access"`                      // Bit field for access control (0: restricted, 1 view, 2 edit)
	Display          *int             `json:"display" form:"display" binding:"omitempty" db:"display"`
	Order            *int             `json:"order" form:"order" binding:"omitempty" db:"order"` // -1 for pinned and -2 for bookmark
	Content          *string          `json:"content" form:"content" db:"content"`
	ContentCompiled  *string          `json:"content_compiled" form:"content_compiled" db:"content_compiled"`
	Size             *int64           `json:"size" form:"size" binding:"omitempty" db:"size"`
	Metadata         *types.JSONB     `json:"metadata" form:"metadata" db:"metadata"`
	CreatedTimestamp int64            `json:"created_timestamp" form:"created_timestamp" binding:"omitempty" db:"created_timestamp"`
	UpdatedTimestamp int64            `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty" db:"updated_timestamp"`

	// Relations
	Permissions []*Permission `json:"permissions" form:"permissions" binding:"omitempty"`
}

// NodeSearchResult represents a search result with relevance score and content snippet
type NodeSearchResult struct {
	Id               types.Snowflake  `json:"id" db:"id"`
	UserId           types.Snowflake  `json:"user_id" db:"user_id"`
	ParentId         *types.Snowflake `json:"parent_id" db:"parent_id"`
	Name             string           `json:"name" db:"name"`
	Description      *string          `json:"description" db:"description"`
	Tags             *string          `json:"tags" db:"tags"`
	Role             int              `json:"role" db:"role"`
	Icon             *string          `json:"icon" db:"icon"`
	Relevance        float64          `json:"relevance" db:"relevance"`
	ContentSnippet   *string          `json:"content_snippet,omitempty" db:"content_snippet"`
	CreatedTimestamp int64            `json:"created_timestamp" db:"created_timestamp"`
	UpdatedTimestamp int64            `json:"updated_timestamp" db:"updated_timestamp"`
}

// NodeResourceInfo contains minimal info needed to delete a resource file from storage
type NodeResourceInfo struct {
	Id       types.Snowflake `json:"id" db:"id"`
	UserId   types.Snowflake `json:"user_id" db:"user_id"`
	Metadata *types.JSONB    `json:"metadata" db:"metadata"`
}
