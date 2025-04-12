package services

import (
	"alexandrie/models"
	"database/sql"
)

type CategoryService interface {
	GetAllCategories(userId int64) ([]*models.Category, error)
}

func NewCategoryService(db *sql.DB) CategoryService {
	return &Service{db: db}
}

func (s *Service) GetAllCategories(userId int64) ([]*models.Category, error) {
	var categories []*models.Category
	rows, err := s.db.Query("SELECT * FROM categories WHERE author_id = ? ORDER BY `order`", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.Id, &category.Name, &category.Icon, &category.Order, &category.Role, &category.WorkspaceId, &category.ParentId, &category.AuthorId); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}
	return categories, nil
}
