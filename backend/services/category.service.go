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
	rows, err := s.db.Query(`
		SELECT n.id, c.name, n.icon, n.color, c.order, n.role, n.parent_id, n.user_id
		FROM nodes n
		JOIN categories c ON n.id = c.node_id
		WHERE (n.role = 1 OR n.role = 2) AND n.user_id = ?
		ORDER BY c.order
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var category models.Category
		if err := rows.Scan(
			&category.Id,
			&category.Name,
			&category.Icon,
			&category.Color,
			&category.Order,
			&category.Role,
			&category.ParentId,
			&category.UserId,
		); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}
	return categories, nil
}

func (s *Service) GetCategory(categoryId types.Snowflake) (*models.Category, error) {
	var category models.Category
	err := s.db.QueryRow(`
		SELECT n.id, c.name, n.icon, c.color, c.order, c.role, n.parent_id, n.user_id
		FROM nodes n
		JOIN categories c ON n.id = c.id
		WHERE n.id = ? AND n.role = 1
	`, categoryId).Scan(
		&category.Id,
		&category.Name,
		&category.Icon,
		&category.Color,
		&category.Order,
		&category.Role,
		&category.ParentId,
		&category.UserId,
	)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *Service) CreateCategory(category *models.Category) error {
	// Insert node
	_, err := s.db.Exec(`INSERT INTO nodes (id, role, parent_id, user_id, created_timestamp, updated_timestamp) VALUES (?, 1, ?, ?, ?, ?)
	`, category.Id, category.ParentId, category.UserId, category.CreatedTimestamp, category.UpdatedTimestamp)
	if err != nil {
		return err
	}

	// Then insert category
	_, err = s.db.Exec(`INSERT INTO categories (id, name, color, 'order', role) VALUES (?, ?, ?, ?, ?, ?)`, category.Id, category.Name, category.Color, category.Order, category.Role)
	return err
}

func (s *Service) UpdateCategory(category *models.Category) error {
	// Update nodes
	_, err := s.db.Exec(`UPDATE nodes SET parent_id = ?, icon = ?, updated_timestamp = ? WHERE id = ?`, category.ParentId, category.Icon, category.UpdatedTimestamp, category.Id)
	if err != nil {
		return err
	}

	// Update categories
	_, err = s.db.Exec(`UPDATE categories SET name = ?, color = ?, 'order' = ?, role = ? WHERE id = ?`, category.Name, category.Color, category.Order, category.Role, category.Id)
	return err
}

func (s *Service) DeleteCategory(categoryId types.Snowflake) error {
	_, err := s.db.Exec(`
		DELETE FROM nodes
		WHERE id = ?
	`, categoryId)
	return err
}
