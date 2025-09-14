package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type NodeService interface {
	GetAllNodes(userId types.Snowflake) ([]*models.Node, error)
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
	rows, err := s.db.Query("SELECT `id`, `user_id`, `parent_id`, `name`, `description`, `tags`, `role`, `color`, `icon`, `theme`, `accessibility`, `display`, `order`, `size`, `metadata`, `created_timestamp`, `updated_timestamp` FROM nodes WHERE user_id = ? ORDER BY `role`, `order` DESC, name", userId)
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
	_, err := s.db.Exec("UPDATE nodes SET `parent_id` = ?, `name` = ?, `description` = ?, `tags` = ?, `role` = ?, `color` = ?, `icon` = ?, `thumbnail` = ?, `theme` = ?, `accessibility` = ?, `display` = ?, `order` = ?, `content` = ?, `content_compiled` = ?, `metadata` = ?, `updated_timestamp` = ? WHERE id = ?",
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
		node.Metadata,
		node.UpdatedTimestamp,
		node.Id)
	return err
}

func (s *Service) DeleteNode(nodeId types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM nodes WHERE `id` = ?", nodeId)
	return err
}
