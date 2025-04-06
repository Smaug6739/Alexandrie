package models

type Document struct {
	Id               int64   `json:"id" form:"id" binding:"omitempty"`
	Name             string  `json:"name" `
	Description      *string `json:"description"`
	Tags             *string `json:"tags"`
	Category         *int64  `json:"category"`
	ParentId         *int64  `json:"parent_id"`
	Accessibility    int     `json:"accessibility"`
	ContentMarkdown  *string `json:"content_markdown"`
	ContentHtml      *string `json:"content_html"`
	AuthorId         int64   `json:"author_id"`
	CreatedTimestamp int64   `json:"created_timestamp"`
	UpdatedTimestamp int64   `json:"updated_timestamp"`
}
