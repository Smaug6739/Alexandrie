package models

import "alexandrie/types"

type Ressource struct {
	Id               types.Snowflake `json:"id" form:"id" binding:"omitempty"`
	Filename         string          `json:"filename" form:"filename" binding:"required,max=50"`
	Filesize         int64           `json:"filesize" form:"filesize" binding:"omitempty"`
	Filetype         string          `json:"filetype" form:"filetype" binding:"omitempty"`
	OriginalPath     string          `json:"original_path" form:"original_path" binding:"omitempty"`
	TransformedPath  string          `json:"transformed_path" form:"transformed_path" binding:"omitempty"`
	AuthorId         types.Snowflake `json:"author_id" form:"author_id" binding:"omitempty"`
	CreatedTimestamp int64           `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
}
