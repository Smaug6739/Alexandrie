package services

import (
	"alexandrie/types"
	"database/sql"
)

type PermissionService interface {
	HasPermission(userId, nodeId types.Snowflake, required int) bool
	//GrantPermission(userId, nodeId types.Snowflake, permission int) error
	//RevokePermission(userId, nodeId types.Snowflake) error
}

func NewPermissionService(db *sql.DB) PermissionService {
	return &Service{db: db}
}

func (s *Service) HasPermission(userId, nodeId types.Snowflake, required int) bool {
	var perm int
	err := s.db.QueryRow(`
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

	if err == sql.ErrNoRows {
		return false
	}
	if err != nil {
		return false
	}

	if perm == 0 {
		return false
	}

	//fmt.Println("User", userId, "has inherited permission", perm, "on node", nodeId, "required:", required)
	return perm >= required
}
