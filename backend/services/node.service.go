package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"strings"
)

type NodeService interface {
	GetAllNodes(userId types.Snowflake) ([]*models.Node, error)
	GetSharedNodes(userId types.Snowflake) ([]*models.Node, error)
	GetAllNodeBackup(user_id types.Snowflake) ([]*models.Node, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	GetPublicNode(nodeId types.Snowflake) (*models.Node, error)
	GetNode(nodeId types.Snowflake) (*models.Node, error)
	CreateNode(node *models.Node) error
	UpdateNode(node *models.Node) error
	DeleteNode(nodeId types.Snowflake) error
}

func NewNodeService(db *sql.DB) NodeService {
	return &Service{db: db}
}

func (s *Service) GetAllNodes(userId types.Snowflake) ([]*models.Node, error) {
	var nodes = make([]*models.Node, 0)
	rows, err := s.db.Query(`WITH RECURSIVE user_nodes AS (
    -- 1. Every node owned by the user
    SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
           n.accessibility, n.display, n.order, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
    FROM nodes n
    WHERE n.user_id = ?

    UNION

    -- 2. Child nodes of owned nodes (even if not owned by the user)
    SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
           c.accessibility, c.display, c.order, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
    FROM nodes c
    JOIN user_nodes un ON un.id = c.parent_id
)
SELECT * FROM user_nodes ORDER BY role, 'order' DESC, name;`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var node models.Node
		if err := rows.Scan(
			&node.Id,
			&node.UserId,
			&node.ParentId,
			&node.Name,
			&node.Description,
			&node.Tags,
			&node.Role,
			&node.Color,
			&node.Icon,
			&node.Theme,
			&node.Accessibility,
			&node.Display,
			&node.Order,
			&node.Size,
			&node.Metadata,
			&node.CreatedTimestamp,
			&node.UpdatedTimestamp,
		); err != nil {
			return nil, err
		}
		nodes = append(nodes, &node)
	}
	return nodes, nil
}

func (s *Service) GetSharedNodes(userId types.Snowflake) ([]*models.Node, error) {
	var nodes = make([]*models.Node, 0)

	// 1. Get all accessible nodes (owned or shared, including children of owned/shared nodes)
	rows, err := s.db.Query(`
		WITH RECURSIVE accessible_nodes AS (
		    SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
		           n.accessibility, n.display, n.order, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
		    FROM nodes n
		    JOIN permissions p ON p.node_id = n.id
		    WHERE p.user_id = ?

		    UNION

		    SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
		           c.accessibility, c.display, c.order, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
		    FROM nodes c
		    JOIN accessible_nodes an ON an.id = c.parent_id
		)
		SELECT * FROM accessible_nodes;
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	nodeMap := make(map[types.Snowflake]*models.Node)
	for rows.Next() {
		var node models.Node
		if err := rows.Scan(
			&node.Id,
			&node.UserId,
			&node.ParentId,
			&node.Name,
			&node.Description,
			&node.Tags,
			&node.Role,
			&node.Color,
			&node.Icon,
			&node.Theme,
			&node.Accessibility,
			&node.Display,
			&node.Order,
			&node.Size,
			&node.Metadata,
			&node.CreatedTimestamp,
			&node.UpdatedTimestamp,
		); err != nil {
			return nil, err
		}
		node.Permissions = []*models.Permission{}
		nodes = append(nodes, &node)
		nodeMap[node.Id] = &node
	}

	// 2. Get permissions for the retrieved nodes
	if len(nodes) > 0 {
		nodeIDs := make([]interface{}, 0, len(nodes))
		for _, n := range nodes {
			nodeIDs = append(nodeIDs, n.Id)
		}

		query := `SELECT id, node_id, user_id, permission, created_timestamp FROM permissions WHERE node_id IN (?` + strings.Repeat(",?", len(nodeIDs)-1) + `)`
		stmt, err := s.db.Prepare(query)
		if err != nil {
			return nil, err
		}
		defer stmt.Close()

		args := nodeIDs
		permRows, err := stmt.Query(args...)
		if err != nil {
			return nil, err
		}
		defer permRows.Close()

		for permRows.Next() {
			var p models.Permission
			if err := permRows.Scan(&p.Id, &p.NodeId, &p.UserId, &p.Permission, &p.CreatedTimestamp); err != nil {
				return nil, err
			}

			if node, ok := nodeMap[p.NodeId]; ok {
				node.Permissions = append(node.Permissions, &p)
			}
		}
	}

	return nodes, nil
}

func (s *Service) GetAllNodeBackup(user_id types.Snowflake) ([]*models.Node, error) {
	var nodes = make([]*models.Node, 0)
	rows, err := s.db.Query("SELECT `id`, `user_id`, `parent_id`, `name`, `description`, `tags`, `role`, `color`, `icon`, `thumbnail`, `theme`, `accessibility`, `display`, `order`, `content`, `content_compiled`, `size`, `metadata`, `created_timestamp`, `updated_timestamp` FROM nodes WHERE user_id = ?", user_id)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var node models.Node
		if err := rows.Scan(
			&node.Id,
			&node.UserId,
			&node.ParentId,
			&node.Name,
			&node.Description,
			&node.Tags,
			&node.Role,
			&node.Color,
			&node.Icon,
			&node.Thumbnail,
			&node.Theme,
			&node.Accessibility,
			&node.Display,
			&node.Order,
			&node.Content,
			&node.ContentCompiled,
			&node.Size,
			&node.Metadata,
			&node.CreatedTimestamp,
			&node.UpdatedTimestamp); err != nil {
			return nil, err
		}
		nodes = append(nodes, &node)
	}
	return nodes, nil
}

func (s *Service) GetUserUploadsSize(userId types.Snowflake) (int64, error) {
	var totalSize *int64
	err := s.db.QueryRow("SELECT SUM(size) FROM nodes WHERE user_id = ?", userId).Scan(&totalSize)
	if err != nil {
		return 0, err
	}
	if totalSize == nil {
		return 0, nil
	}
	return *totalSize, nil
}

func (s *Service) GetPublicNode(nodeId types.Snowflake) (*models.Node, error) {
	var node models.Node
	err := s.db.QueryRow("SELECT `id`, `user_id`, `parent_id`, `name`, `description`, `tags`, `role`, `color`, `icon`, `thumbnail`, `theme`, `accessibility`, `display`, `order`, `content`, `content_compiled`, `size`, `metadata`, `created_timestamp`, `updated_timestamp` FROM nodes WHERE id = ? AND accessibility = 3", nodeId).Scan(
		&node.Id,
		&node.UserId,
		&node.ParentId,
		&node.Name,
		&node.Description,
		&node.Tags,
		&node.Role,
		&node.Color,
		&node.Icon,
		&node.Thumbnail,
		&node.Theme,
		&node.Accessibility,
		&node.Display,
		&node.Order,
		&node.Content,
		&node.ContentCompiled,
		&node.Size,
		&node.Metadata,
		&node.CreatedTimestamp,
		&node.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}
	return &node, nil
}

func (s *Service) GetNode(nodeId types.Snowflake) (*models.Node, error) {
	var node models.Node
	err := s.db.QueryRow("SELECT `id`, `user_id`, `parent_id`, `name`, `description`, `tags`, `role`, `color`, `icon`, `thumbnail`, `theme`, `accessibility`, `display`, `order`, `content`, `content_compiled`, `size`, `metadata`, `created_timestamp`, `updated_timestamp` FROM nodes WHERE id = ?", nodeId).Scan(
		&node.Id,
		&node.UserId,
		&node.ParentId,
		&node.Name,
		&node.Description,
		&node.Tags,
		&node.Role,
		&node.Color,
		&node.Icon,
		&node.Thumbnail,
		&node.Theme,
		&node.Accessibility,
		&node.Display,
		&node.Order,
		&node.Content,
		&node.ContentCompiled,
		&node.Size,
		&node.Metadata,
		&node.CreatedTimestamp,
		&node.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}
	return &node, nil
}

func (s *Service) CreateNode(node *models.Node) error {
	_, err := s.db.Exec("INSERT INTO nodes (`id`, `user_id`, `parent_id`, `name`, `description`, `tags`, `role`, `color`, `icon`, `thumbnail`, `theme`, `accessibility`, `display`, `order`, `content`, `content_compiled`, `size`, `metadata`, `created_timestamp`, `updated_timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		node.Id,
		node.UserId,
		node.ParentId,
		node.Name,
		node.Description,
		node.Tags,
		node.Role,
		node.Color,
		node.Icon,
		node.Thumbnail,
		node.Theme,
		node.Accessibility,
		node.Display,
		node.Order,
		node.Content,
		node.ContentCompiled,
		node.Size,
		node.Metadata,
		node.CreatedTimestamp,
		node.UpdatedTimestamp)
	return err
}

func (s *Service) UpdateNode(node *models.Node) error {
	_, err := s.db.Exec("UPDATE nodes SET `parent_id` = ?, `user_id` = ?, `name` = ?, `description` = ?, `tags` = ?, `role` = ?, `color` = ?, `icon` = ?, `thumbnail` = ?, `theme` = ?, `accessibility` = ?, `display` = ?, `order` = ?, `content` = ?, `content_compiled` = ?, `metadata` = ?, `updated_timestamp` = ? WHERE id = ?",
		node.ParentId,
		node.UserId,
		node.Name,
		node.Description,
		node.Tags,
		node.Role,
		node.Color,
		node.Icon,
		node.Thumbnail,
		node.Theme,
		node.Accessibility,
		node.Display,
		node.Order,
		node.Content,
		node.ContentCompiled,
		node.Metadata,
		node.UpdatedTimestamp,
		node.Id)
	return err
}

func (s *Service) DeleteNode(nodeId types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM nodes WHERE `id` = ?", nodeId)
	return err
}
