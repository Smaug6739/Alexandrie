package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type PermissionService interface {
	GetNodePermission(nodeId types.Snowflake) ([]*models.Permission, error)
	GetPermission(id types.Snowflake) (*models.Permission, error)
	HasPermission(userId, nodeId types.Snowflake, required int) (bool, int)
	CreatePermission(permission *models.Permission) error
	UpdatePermission(id types.Snowflake, permission int) error
	DeletePermission(id types.Snowflake) error
}

func NewPermissionService(db *sql.DB) PermissionService {
	return &Service{db: db}
}

func (s *Service) GetPermission(id types.Snowflake) (*models.Permission, error) {
	var p models.Permission
	err := s.db.QueryRow(`SELECT id, node_id, user_id, permission, created_timestamp FROM permissions WHERE id = ?`, id).Scan(
		&p.Id, &p.NodeId, &p.UserId, &p.Permission, &p.CreatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *Service) GetNodePermission(nodeId types.Snowflake) ([]*models.Permission, error) {
	rows, err := s.db.Query(`
		SELECT id, node_id, user_id, permission, created_timestamp
		FROM permissions
		WHERE node_id = ?
	`, nodeId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var permissions []*models.Permission
	for rows.Next() {
		var p models.Permission
		if err := rows.Scan(&p.Id, &p.NodeId, &p.UserId, &p.Permission, &p.CreatedTimestamp); err != nil {
			return nil, err
		}
		permissions = append(permissions, &p)
	}
	return permissions, nil
}

func (s *Service) HasPermission(userId, nodeId types.Snowflake, required int) (bool, int) {
	var perm int
	s.db.QueryRow(`
		WITH RECURSIVE ancestors AS (
			-- Start with the given node
			SELECT id, parent_id
			FROM nodes
			WHERE id = ?

			UNION ALL

			-- Recursively find all ancestors
			SELECT n.id, n.parent_id
			FROM nodes n
			INNER JOIN ancestors a ON a.parent_id = n.id
		)
		SELECT MAX(p.permission)
		FROM permissions p
		INNER JOIN ancestors an ON an.id = p.node_id
		WHERE p.user_id = ?
	`, nodeId, userId).Scan(&perm)

	// Case 1 : Explicit permission sufficient
	if perm >= required {
		return true, perm
	}

	// Case 2 : Not enough permissions → check if owner of an ancestor
	var owns int
	err := s.db.QueryRow(`
		WITH RECURSIVE ancestors AS (
			SELECT id, parent_id, user_id
			FROM nodes
			WHERE id = ?

			UNION ALL

			SELECT n.id, n.parent_id, n.user_id
			FROM nodes n
			INNER JOIN ancestors a ON a.parent_id = n.id
		)
		SELECT 1
		FROM ancestors
		WHERE user_id = ?
		LIMIT 1
	`, nodeId, userId).Scan(&owns)
	if err == nil && owns == 1 {
		return true, 4
	}

	// Otherwise no permission
	return false, 0
}

func (s *Service) CreatePermission(permission *models.Permission) error {
	_, err := s.db.Exec(`INSERT INTO permissions (id, node_id, user_id, permission, created_timestamp) VALUES (?, ?, ?, ?, ?)`,
		permission.Id, permission.NodeId, permission.UserId, permission.Permission, permission.CreatedTimestamp)
	return err
}

func (s *Service) UpdatePermission(id types.Snowflake, permission int) error {
	_, err := s.db.Exec(`UPDATE permissions SET permission = ? WHERE id = ?`, permission, id)
	return err
}

func (s *Service) DeletePermission(id types.Snowflake) error {
	_, err := s.db.Exec(`DELETE FROM permissions WHERE id = ?`, id)
	return err
}
