package models

type Category struct {
	Id          uint64  `json:"id" form:"id" binding:"omitempty"`
	Name        string  `json:"name" form:"name" binding:"required,max=50"`
	Icon        string  `json:"icon" form:"icon" binding:"omitempty,max=30000"`
	Order       int     `json:"order" form:"order" binding:"omitempty"`
	Role        int     `json:"role" form:"role" binding:"omitempty"` // 0 category; 1 workspace;
	WorkspaceId *uint64 `json:"workspace_id" form:"workspace_id" binding:"omitempty"`
	ParentId    *uint64 `json:"parent_id" form:"parent_id" binding:"omitempty"`
	AuthorId    uint64  `json:"author_id" form:"author_id" binding:"omitempty"`
}
