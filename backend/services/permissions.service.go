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

	// Cas 1 : permission explicite suffisante
	if perm >= required {
		return true
	}

	// Cas 2 : pas assez de permissions → vérifier si propriétaire d’un ancêtre
	var owns int
	err = s.db.QueryRow(`
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
		// propriétaire d’un ancêtre = permission max
		return required <= 3
	}

	// sinon pas de permission
	return false
}
