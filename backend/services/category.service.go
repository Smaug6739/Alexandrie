package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type CategoryService interface {
	GetAllCategories(userId types.Snowflake) ([]*models.Category, error)
	GetCategory(categoryId types.Snowflake) (*models.Category, error)
	CreateCategory(category *models.Category) error
	UpdateCategory(category *models.Category) error
	DeleteCategory(categoryId types.Snowflake) error
}

func NewCategoryService(db *sql.DB) CategoryService {
	return &Service{db: db}
}

func (s *Service) GetAllCategories(userId types.Snowflake) ([]*models.Category, error) {
	var categories = make([]*models.Category, 0)
	rows, err := s.db.Query("SELECT * FROM categories WHERE author_id = ? ORDER BY `order`", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.Id, &category.Name, &category.Icon, &category.Color, &category.Order, &category.Role, &category.WorkspaceId, &category.ParentId, &category.AuthorId); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}
	return categories, nil
}

func (s *Service) GetCategory(categoryId types.Snowflake) (*models.Category, error) {
	var category models.Category
	err := s.db.QueryRow("SELECT * FROM categories WHERE id = ?", categoryId).Scan(
		&category.Id,
		&category.Name,
		&category.Icon,
		&category.Color,
		&category.Order,
		&category.Role,
		&category.WorkspaceId,
		&category.ParentId,
		&category.AuthorId)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *Service) CreateCategory(category *models.Category) error {
	_, err := s.db.Exec("INSERT INTO categories (id, name, icon, color, `order`, role, workspace_id, parent_id, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		category.Id,
		category.Name,
		category.Icon,
		category.Color,
		category.Order,
		category.Role,
		category.WorkspaceId,
		category.ParentId,
		category.AuthorId)
	return err
}

func (s *Service) UpdateCategory(category *models.Category) error {
	_, err := s.db.Exec("UPDATE categories SET name = ?, icon = ?, color = ?, `order` = ?, role = ?, workspace_id = ?, parent_id = ? WHERE id = ?",
		category.Name,
		category.Icon,
		category.Color,
		category.Order,
		category.Role,
		category.WorkspaceId,
		category.ParentId,
		category.Id)
	return err
}

func (s *Service) DeleteCategory(categoryId types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM categories WHERE id = ?", categoryId)
	return err
}
