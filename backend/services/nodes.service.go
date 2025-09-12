package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type NodesService interface {
	GetTree(id types.Snowflake, userId types.Snowflake) ([]*models.Node, error)
}

func NewNodesService(db *sql.DB) NodesService {
	return &Service{db: db}
}

func (s *Service) GetTree(id types.Snowflake, userId types.Snowflake) ([]*models.Node, error) {
	var nodes = make([]*models.Node, 0)

	rows, err := s.db.Query(`
		WITH RECURSIVE node_tree AS (
			SELECT *
			FROM nodes
			WHERE id = ? AND user_id = ?

			UNION ALL

			SELECT n.*
			FROM nodes n
			INNER JOIN node_tree nt ON n.parent_id = nt.id
			WHERE n.user_id = ?
		)
		SELECT id, user_id, role, parent_id, color, icon, created_timestamp, updated_timestamp
		FROM node_tree
		ORDER BY parent_id, id
	`, id, userId, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var node models.Node
		if err := rows.Scan(
			&node.Id,
			&node.UserId,
			&node.Role,
			&node.ParentId,
			&node.Color,
			&node.Icon,
			&node.CreatedTimestamp,
			&node.UpdatedTimestamp,
		); err != nil {
			return nil, err
		}
		nodes = append(nodes, &node)
	}

	return nodes, nil
}
