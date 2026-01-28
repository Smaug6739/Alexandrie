package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
)

type NodeRepositoryImpl struct {
	db *sqlx.DB
}

type NodeRepository interface {
	GetAll(userId types.Snowflake) ([]*models.Node, error)
	GetShared(userId types.Snowflake) ([]*models.Node, error)
	GetAllForBackup(userId types.Snowflake) ([]*models.Node, error)
	GetByID(nodeId types.Snowflake) (*models.Node, error)
	GetPublic(nodeId types.Snowflake) (*models.Node, error)
	GetPublicDescendants(nodeId types.Snowflake) ([]*models.Node, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	GetDescendantResources(nodeId types.Snowflake) ([]*models.NodeResourceInfo, error)
	SearchFulltext(userId types.Snowflake, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error)
	Create(node *models.Node) error
	Update(node *models.Node) error
	Delete(nodeId types.Snowflake) error
}

func NewNodeRepository(db *sqlx.DB) NodeRepository {
	return &NodeRepositoryImpl{db: db}
}

// GetAll retrieves all nodes for a user using recursive CTE
func (r *NodeRepositoryImpl) GetAll(userId types.Snowflake) ([]*models.Node, error) {
	var nodes []*models.Node
	err := r.db.Select(&nodes, `
		WITH RECURSIVE user_nodes AS (
			-- 1. Every node owned by the user
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
				   n.accessibility, n.access, n.display, n.`+"`order`"+`, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
			FROM nodes n
			WHERE n.user_id = ?

			UNION

			-- 2. Child nodes of owned nodes (even if not owned by the user)
			SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
				   c.accessibility, c.access, c.display, c.`+"`order`"+`, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
			FROM nodes c
			JOIN user_nodes un ON un.id = c.parent_id
		)
		SELECT * FROM user_nodes ORDER BY role, 'order' DESC, name`, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query user nodes: %w", err)
	}
	return nodes, nil
}

// GetShared retrieves all shared nodes for a user with optimized query
func (r *NodeRepositoryImpl) GetShared(userId types.Snowflake) ([]*models.Node, error) {
	var nodes []*models.Node
	err := r.db.Select(&nodes, `
		WITH RECURSIVE shared_nodes AS (
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
				   n.accessibility, n.access, n.display, n.`+"`order`"+`, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
			FROM nodes n
			JOIN permissions p ON p.node_id = n.id
			WHERE p.user_id = ?

			UNION

			SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
				   c.accessibility, c.access, c.display, c.`+"`order`"+`, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
			FROM nodes c
			JOIN shared_nodes an ON an.id = c.parent_id
		)
		SELECT * FROM shared_nodes`, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query shared nodes: %w", err)
	}

	// Build node map for permission loading
	nodeMap := make(map[types.Snowflake]*models.Node)
	for _, node := range nodes {
		node.Permissions = []*models.Permission{}
		nodeMap[node.Id] = node
	}

	// Batch fetch permissions for all nodes
	if len(nodes) > 0 {
		if err := r.loadPermissionsForNodes(userId, nodeMap); err != nil {
			return nil, fmt.Errorf("failed to load permissions: %w", err)
		}
	}

	return nodes, nil
}

// loadPermissionsForNodes loads permissions for multiple nodes in a single query
func (r *NodeRepositoryImpl) loadPermissionsForNodes(userId types.Snowflake, nodeMap map[types.Snowflake]*models.Node) error {
	if len(nodeMap) == 0 {
		return nil
	}

	// Build the IN clause
	nodeIDs := make([]interface{}, 0, len(nodeMap))
	placeholders := make([]string, 0, len(nodeMap))
	for nodeId := range nodeMap {
		nodeIDs = append(nodeIDs, nodeId)
		placeholders = append(placeholders, "?")
	}

	query := fmt.Sprintf(`
		SELECT id, node_id, user_id, permission, created_timestamp 
		FROM permissions 
		WHERE user_id = ? AND node_id IN (%s)`,
		strings.Join(placeholders, ","))

	args := append([]interface{}{userId}, nodeIDs...)
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return fmt.Errorf("failed to query permissions: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var p models.Permission
		if err := rows.Scan(&p.Id, &p.NodeId, &p.UserId, &p.Permission, &p.CreatedTimestamp); err != nil {
			return fmt.Errorf("failed to scan permission: %w", err)
		}

		if node, ok := nodeMap[p.NodeId]; ok {
			node.Permissions = append(node.Permissions, &p)
		}
	}

	return rows.Err()
}

// GetAllForBackup retrieves all nodes for backup (includes full content)
func (r *NodeRepositoryImpl) GetAllForBackup(userId types.Snowflake) ([]*models.Node, error) {
	var nodes []*models.Node
	err := r.db.Select(&nodes, `
		SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
		       accessibility, access, display, `+"`order`"+`, content, content_compiled, size, metadata, 
		       created_timestamp, updated_timestamp 
		FROM nodes 
		WHERE user_id = ?`, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query nodes for backup: %w", err)
	}
	return nodes, nil
}

// GetByID retrieves a single node by ID
func (r *NodeRepositoryImpl) GetByID(nodeId types.Snowflake) (*models.Node, error) {
	var node models.Node
	err := r.db.Get(&node, `
		SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
		       accessibility, access, display, `+"`order`"+`, content, content_compiled, size, metadata, 
		       created_timestamp, updated_timestamp 
		FROM nodes 
		WHERE id = ?`, nodeId)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get node by id: %w", err)
	}
	return &node, nil
}

// GetPublic retrieves a node if it or any of its ancestors is public
// This allows accessing child nodes of a public parent through hierarchical inheritance
func (r *NodeRepositoryImpl) GetPublic(nodeId types.Snowflake) (*models.Node, error) {
	var node models.Node
	err := r.db.Get(&node, `
		WITH RECURSIVE ancestors AS (
			-- Start with the requested node
			SELECT id, parent_id, accessibility
			FROM nodes
			WHERE id = ?
			
			UNION ALL
			
			-- Recursively get parent nodes
			SELECT n.id, n.parent_id, n.accessibility
			FROM nodes n
			JOIN ancestors a ON n.id = a.parent_id
		)
		SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.thumbnail, n.theme, 
		       n.accessibility, n.access, n.display, n.`+"`order`"+`, n.content, n.content_compiled, n.size, n.metadata, 
		       n.created_timestamp, n.updated_timestamp 
		FROM nodes n
		WHERE n.id = ? AND EXISTS (
			SELECT 1 FROM ancestors WHERE accessibility = 3
		)`, nodeId, nodeId)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get public node: %w", err)
	}
	return &node, nil
}

// GetPublicDescendants retrieves ALL descendants of a node recursively (role 1, 2, 3 only)
// Children inherit public access from their parent
func (r *NodeRepositoryImpl) GetPublicDescendants(nodeId types.Snowflake) ([]*models.Node, error) {
	var descendants []*models.Node
	err := r.db.Select(&descendants, `
		WITH RECURSIVE descendant_nodes AS (
			-- Direct children of the public node
			SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme,
			       accessibility, access, display, `+"`order`"+`, size, metadata, 
			       created_timestamp, updated_timestamp
			FROM nodes
			WHERE parent_id = ? AND role IN (1, 2, 3)
			
			UNION ALL
			
			-- Recursively get all descendants
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.thumbnail, n.theme,
			       n.accessibility, n.access, n.display, n.`+"`order`"+`, n.size, n.metadata, 
			       n.created_timestamp, n.updated_timestamp
			FROM nodes n
			JOIN descendant_nodes d ON n.parent_id = d.id
			WHERE n.role IN (1, 2, 3)
		)
		SELECT * FROM descendant_nodes
		ORDER BY role ASC, `+"`order`"+` DESC, name ASC`, nodeId)
	if err != nil {
		return nil, fmt.Errorf("failed to get public descendants: %w", err)
	}
	return descendants, nil
}

// GetUserUploadsSize calculates total upload size for a user
func (r *NodeRepositoryImpl) GetUserUploadsSize(userId types.Snowflake) (int64, error) {
	var totalSize int64
	err := r.db.Get(&totalSize, `SELECT COALESCE(SUM(size), 0) FROM nodes WHERE user_id = ?`, userId)
	if err != nil {
		return 0, fmt.Errorf("failed to get user uploads size: %w", err)
	}
	return totalSize, nil
}

// GetDescendantResources retrieves all descendant nodes with role=4 (resources)
// This is used to clean up MinIO files before deleting a node and its children
func (r *NodeRepositoryImpl) GetDescendantResources(nodeId types.Snowflake) ([]*models.NodeResourceInfo, error) {
	var resources []*models.NodeResourceInfo
	err := r.db.Select(&resources, `
		WITH RECURSIVE descendants AS (
			SELECT id, user_id, role, metadata
			FROM nodes
			WHERE id = ?
			
			UNION ALL
			
			SELECT n.id, n.user_id, n.role, n.metadata
			FROM nodes n
			JOIN descendants d ON n.parent_id = d.id
		)
		SELECT id, user_id, metadata
		FROM descendants
		WHERE role = 4`, nodeId)
	if err != nil {
		return nil, fmt.Errorf("failed to query descendant resources: %w", err)
	}
	return resources, nil
}

// SearchFulltext performs a FULLTEXT search on nodes
// If includeContent is true, it searches in the content body as well
func (r *NodeRepositoryImpl) SearchFulltext(userId types.Snowflake, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	// Clean the query for safety
	cleanQuery := strings.TrimSpace(query)
	if len(cleanQuery) < 2 {
		return []*models.NodeSearchResult{}, nil
	}

	var results []*models.NodeSearchResult
	var err error

	if includeContent {
		// FULLTEXT search including content body
		err = r.db.Select(&results, `
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.icon,
			       MATCH(n.content) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance,
			       SUBSTRING(n.content, 
			           GREATEST(1, LOCATE(?, LOWER(n.content)) - 50), 
			           200) AS content_snippet,
			       n.created_timestamp,
			       n.updated_timestamp
			FROM nodes n
			WHERE n.user_id = ? AND n.role = 3
			  AND MATCH(n.content) AGAINST(? IN NATURAL LANGUAGE MODE)
			ORDER BY relevance DESC
			LIMIT ?`, cleanQuery, strings.ToLower(cleanQuery), userId, cleanQuery, limit)
	} else {
		// FULLTEXT search on name, description, tags only (faster)
		err = r.db.Select(&results, `
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.icon,
			       MATCH(n.name, n.description, n.tags, n.content) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance,
			       NULL AS content_snippet,
			       n.created_timestamp,
			       n.updated_timestamp
			FROM nodes n
			WHERE n.user_id = ? AND n.role = 3
			  AND MATCH(n.name, n.description, n.tags, n.content) AGAINST(? IN NATURAL LANGUAGE MODE)
			ORDER BY relevance DESC
			LIMIT ?`, cleanQuery, userId, cleanQuery, limit)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to execute fulltext search: %w", err)
	}

	return results, nil
}

// Create a new node
func (r *NodeRepositoryImpl) Create(node *models.Node) error {
	_, err := r.db.Exec(`
		INSERT INTO nodes (id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
		                   accessibility, access, display, `+"`order`"+`, content, content_compiled, size, metadata, 
		                   created_timestamp, updated_timestamp) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		node.Id, node.UserId, node.ParentId, node.Name, node.Description, node.Tags, node.Role, node.Color,
		node.Icon, node.Thumbnail, node.Theme, node.Accessibility, node.Access, node.Display, node.Order,
		node.Content, node.ContentCompiled, node.Size, node.Metadata, node.CreatedTimestamp, node.UpdatedTimestamp)
	if err != nil {
		return fmt.Errorf("failed to create node: %w", err)
	}
	return nil
}

// Update an existing node
func (r *NodeRepositoryImpl) Update(node *models.Node) error {
	_, err := r.db.Exec(`
		UPDATE nodes 
		SET parent_id = ?, user_id = ?, name = ?, description = ?, tags = ?, role = ?, color = ?, 
		    icon = ?, thumbnail = ?, theme = ?, accessibility = ?, access = ?, display = ?, `+"`order`"+` = ?, 
		    content = ?, content_compiled = ?, metadata = ?, updated_timestamp = ? 
		WHERE id = ?`,
		node.ParentId, node.UserId, node.Name, node.Description, node.Tags, node.Role, node.Color,
		node.Icon, node.Thumbnail, node.Theme, node.Accessibility, node.Access, node.Display, node.Order,
		node.Content, node.ContentCompiled, node.Metadata, node.UpdatedTimestamp, node.Id)
	if err != nil {
		return fmt.Errorf("failed to update node: %w", err)
	}
	return nil
}

// Delete a node
func (r *NodeRepositoryImpl) Delete(nodeId types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM nodes WHERE id = ?`, nodeId)
	if err != nil {
		return fmt.Errorf("failed to delete node: %w", err)
	}
	return nil
}
