package models

type Document struct {
	Id               int64   `json:"id" form:"id" binding:"omitempty"`
	Name             string  `json:"name" form:"name" binding:"required,max=50"`
	Description      *string `json:"description" form:"description" binding:"omitempty,max=250"`
	Tags             *string `json:"tags" form:"tags" binding:"omitempty,max=250"`
	Category         *int64  `json:"category" form:"category" binding:"omitempty"`
	ParentId         *int64  `json:"parent_id" form:"parent_id" binding:"omitempty"`
	Accessibility    int     `json:"accessibility" form:"accessibility" binding:"required"` // 0: Public; 1: Private; 2: Unlisted;
	ContentMarkdown  *string `json:"content_markdown" form:"content_markdown"`
	ContentHtml      *string `json:"content_html" form:"content_html"`
	AuthorId         int64   `json:"author_id" form:"author_id" binding:"required"`
	CreatedTimestamp int64   `json:"created_timestamp" form:"created_timestamp" binding:"omitempty"`
	UpdatedTimestamp int64   `json:"updated_timestamp" form:"updated_timestamp" binding:"omitempty"`
}
