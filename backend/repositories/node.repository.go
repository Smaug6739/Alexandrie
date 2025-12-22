package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"
	"strings"
)

// NodeRepositoryImpl implements the NodeRepository interface with prepared statements
type NodeRepositoryImpl struct {
	db      *sql.DB
	manager *RepositoryManager
}

// NodeRepository defines the interface for node data access operations
type NodeRepository interface {
	GetAll(userId types.Snowflake) ([]*models.Node, error)
	GetShared(userId types.Snowflake) ([]*models.Node, error)
	GetAllForBackup(userId types.Snowflake) ([]*models.Node, error)
	GetByID(nodeId types.Snowflake) (*models.Node, error)
	GetPublic(nodeId types.Snowflake) (*models.Node, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	GetDescendantResources(nodeId types.Snowflake) ([]*models.NodeResourceInfo, error)
	Create(node *models.Node) error
	Update(node *models.Node) error
	Delete(nodeId types.Snowflake) error
	SearchFulltext(userId types.Snowflake, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error)
}

// Prepared statement keys
const (
	stmNodeGetAll                  = "node_get_all"
	stmNodeGetShared               = "node_get_shared"
	stmNodeGetAllForBackup         = "node_get_all_backup"
	stmtNodeGetByID                = "node_get_by_id"
	stmtNodeGetPublic              = "node_get_public"
	stmtNodeGetUserUploadsSize     = "node_get_user_uploads_size"
	stmtNodeGetDescendantResources = "node_get_descendant_resources"
	stmtNodeCreate                 = "node_create"
	stmtNodeUpdate                 = "node_update"
	stmtNodeDelete                 = "node_delete"
	stmtNodeSearchFulltext         = "node_search_fulltext"
	stmtNodeSearchContent          = "node_search_content"
	// Note: GetAll and GetShared use complex recursive CTEs, prepared separately
)

// NewNodeRepository creates a new node repository with prepared statements
func NewNodeRepository(db *sql.DB, manager *RepositoryManager) (NodeRepository, error) {
	repo := &NodeRepositoryImpl{
		db:      db,
		manager: manager,
	}

	if err := repo.prepareStatements(); err != nil {
		return nil, fmt.Errorf("failed to prepare node statements: %w", err)
	}

	return repo, nil
}

// prepareStatements prepares all SQL statements for the node repository
func (r *NodeRepositoryImpl) prepareStatements() error {
	statements := map[string]string{

		stmNodeGetAll: `
		WITH RECURSIVE user_nodes AS (
		-- 1. Every node owned by the user
		SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
				   n.accessibility, n.access, n.display, n.order, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
		FROM nodes n
		WHERE n.user_id = ?

		UNION

		-- 2. Child nodes of owned nodes (even if not owned by the user)
		SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
				   c.accessibility, c.access, c.display, c.order, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
		FROM nodes c
		JOIN user_nodes un ON un.id = c.parent_id)
		SELECT * FROM user_nodes ORDER BY role, 'order' DESC, name;`,

		stmNodeGetShared: `
		WITH RECURSIVE shared_nodes AS (
		    SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.color, n.icon, n.theme,
		           n.accessibility, n.access, n.display, n.order, n.size, n.metadata, n.created_timestamp, n.updated_timestamp
		    FROM nodes n
		    JOIN permissions p ON p.node_id = n.id
		    WHERE p.user_id = ?

		    UNION

		    SELECT c.id, c.user_id, c.parent_id, c.name, c.description, c.tags, c.role, c.color, c.icon, c.theme,
		           c.accessibility, c.access, c.display, c.order, c.size, c.metadata, c.created_timestamp, c.updated_timestamp
		    FROM nodes c
		    JOIN shared_nodes an ON an.id = c.parent_id
		)
		SELECT * FROM shared_nodes;`,

		stmNodeGetAllForBackup: `
		SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
		       accessibility, access, display, ` + "`order`" + `, content, content_compiled, size, metadata, 
		       created_timestamp, updated_timestamp 
		FROM nodes 
		WHERE user_id = ?`,

		stmtNodeGetByID: `
			SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
			       accessibility, access, display, ` + "`order`" + `, content, content_compiled, size, metadata, 
			       created_timestamp, updated_timestamp 
			FROM nodes 
			WHERE id = ?`,

		stmtNodeGetPublic: `
			SELECT id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
			       accessibility, access, display, ` + "`order`" + `, content, content_compiled, size, metadata, 
			       created_timestamp, updated_timestamp 
			FROM nodes 
			WHERE id = ? AND accessibility = 3`,

		stmtNodeGetUserUploadsSize: `
			SELECT COALESCE(SUM(size), 0) 
			FROM nodes 
			WHERE user_id = ?`,

		// Get all descendant resource nodes (role=4) for cleanup before deletion
		// This includes the node itself if it's a resource, plus all descendant resources
		stmtNodeGetDescendantResources: `
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
			WHERE role = 4`,

		stmtNodeCreate: `
			INSERT INTO nodes (id, user_id, parent_id, name, description, tags, role, color, icon, thumbnail, theme, 
			                   accessibility, access, display, ` + "`order`" + `, content, content_compiled, size, metadata, 
			                   created_timestamp, updated_timestamp) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

		stmtNodeUpdate: `
			UPDATE nodes 
			SET parent_id = ?, user_id = ?, name = ?, description = ?, tags = ?, role = ?, color = ?, 
			    icon = ?, thumbnail = ?, theme = ?, accessibility = ?, access = ?, display = ?, ` + "`order`" + ` = ?, 
			    content = ?, content_compiled = ?, metadata = ?, updated_timestamp = ? 
			WHERE id = ?`,

		stmtNodeDelete: `
			DELETE FROM nodes 
			WHERE id = ?`,

		// FULLTEXT search on name, description, tags only (faster, for quick search)
		stmtNodeSearchFulltext: `
			SELECT n.id, n.user_id, n.parent_id, n.name, n.description, n.tags, n.role, n.icon,
			       MATCH(n.name, n.description, n.tags, n.content) AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance,
			       NULL AS content_snippet,
						 n.created_timestamp,
			       n.updated_timestamp
			FROM nodes n
			WHERE n.user_id = ? AND n.role = 3
			  AND MATCH(n.name, n.description, n.tags, n.content) AGAINST(? IN NATURAL LANGUAGE MODE)
			ORDER BY relevance DESC
			LIMIT ?`,

		// FULLTEXT search including content body (for content search)
		stmtNodeSearchContent: `
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
			LIMIT ?`,
	}

	// Prepare all statements
	for key, query := range statements {
		if _, err := r.manager.PrepareStatement(key, query); err != nil {
			return err
		}
	}

	return nil
}

// scanNode scans a node from a database row
func (r *NodeRepositoryImpl) scanNode(scanner interface {
	Scan(dest ...interface{}) error
}) (*models.Node, error) {
	var node models.Node
	err := scanner.Scan(
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
		&node.Access,
		&node.Display,
		&node.Order,
		&node.Content,
		&node.ContentCompiled,
		&node.Size,
		&node.Metadata,
		&node.CreatedTimestamp,
		&node.UpdatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &node, nil
}

// scanNodePartial scans a node without content fields (for list views)
func (r *NodeRepositoryImpl) scanNodePartial(scanner interface {
	Scan(dest ...interface{}) error
}) (*models.Node, error) {
	var node models.Node
	err := scanner.Scan(
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
		&node.Access,
		&node.Display,
		&node.Order,
		&node.Size,
		&node.Metadata,
		&node.CreatedTimestamp,
		&node.UpdatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &node, nil
}

// GetAll retrieves all nodes for a user using recursive CTE
func (r *NodeRepositoryImpl) GetAll(userId types.Snowflake) ([]*models.Node, error) {
	stmt, err := r.manager.GetStatement("node_get_all")
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query user nodes: %w", err)
	}
	defer rows.Close()

	nodes := make([]*models.Node, 0)
	for rows.Next() {
		node, err := r.scanNodePartial(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan node: %w", err)
		}
		nodes = append(nodes, node)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating nodes: %w", err)
	}

	return nodes, nil
}

// GetShared retrieves all shared nodes for a user with optimized query
func (r *NodeRepositoryImpl) GetShared(userId types.Snowflake) ([]*models.Node, error) {
	stmt, err := r.manager.GetStatement("node_get_shared")
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query shared nodes: %w", err)
	}
	defer rows.Close()

	nodeMap := make(map[types.Snowflake]*models.Node)
	nodes := make([]*models.Node, 0)

	for rows.Next() {
		node, err := r.scanNodePartial(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan node: %w", err)
		}
		node.Permissions = []*models.Permission{}
		nodes = append(nodes, node)
		nodeMap[node.Id] = node
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating nodes: %w", err)
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

	// Prepare this query (it's dynamic so we prepare it on-the-fly)
	stmt, err := r.db.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare permissions query: %w", err)
	}
	defer stmt.Close()

	args := append([]interface{}{userId}, nodeIDs...)
	rows, err := stmt.Query(args...)
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
	stmt, err := r.manager.GetStatement("node_get_all_backup")
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query nodes for backup: %w", err)
	}
	defer rows.Close()

	nodes := make([]*models.Node, 0)
	for rows.Next() {
		node, err := r.scanNode(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan node: %w", err)
		}
		nodes = append(nodes, node)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating nodes: %w", err)
	}

	return nodes, nil
}

// GetByID retrieves a single node by ID
func (r *NodeRepositoryImpl) GetByID(nodeId types.Snowflake) (*models.Node, error) {
	stmt, err := r.manager.GetStatement(stmtNodeGetByID)
	if err != nil {
		return nil, err
	}

	node, err := r.scanNode(stmt.QueryRow(nodeId))
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get node by id: %w", err)
	}

	return node, nil
}

// GetPublic retrieves a public node by ID
func (r *NodeRepositoryImpl) GetPublic(nodeId types.Snowflake) (*models.Node, error) {
	stmt, err := r.manager.GetStatement(stmtNodeGetPublic)
	if err != nil {
		return nil, err
	}

	node, err := r.scanNode(stmt.QueryRow(nodeId))
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get public node: %w", err)
	}

	return node, nil
}

// GetUserUploadsSize calculates total upload size for a user
func (r *NodeRepositoryImpl) GetUserUploadsSize(userId types.Snowflake) (int64, error) {
	stmt, err := r.manager.GetStatement(stmtNodeGetUserUploadsSize)
	if err != nil {
		return 0, err
	}

	var totalSize int64
	err = stmt.QueryRow(userId).Scan(&totalSize)
	if err != nil {
		return 0, fmt.Errorf("failed to get user uploads size: %w", err)
	}

	return totalSize, nil
}

// GetDescendantResources retrieves all descendant nodes with role=4 (resources)
// This is used to clean up MinIO files before deleting a node and its children
func (r *NodeRepositoryImpl) GetDescendantResources(nodeId types.Snowflake) ([]*models.NodeResourceInfo, error) {
	stmt, err := r.manager.GetStatement(stmtNodeGetDescendantResources)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(nodeId)
	if err != nil {
		return nil, fmt.Errorf("failed to query descendant resources: %w", err)
	}
	defer rows.Close()

	resources := make([]*models.NodeResourceInfo, 0)
	for rows.Next() {
		var res models.NodeResourceInfo
		if err := rows.Scan(&res.Id, &res.UserId, &res.Metadata); err != nil {
			return nil, fmt.Errorf("failed to scan resource info: %w", err)
		}
		resources = append(resources, &res)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating descendant resources: %w", err)
	}

	return resources, nil
}

// Create creates a new node
func (r *NodeRepositoryImpl) Create(node *models.Node) error {
	stmt, err := r.manager.GetStatement(stmtNodeCreate)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(
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
		node.Access,
		node.Display,
		node.Order,
		node.Content,
		node.ContentCompiled,
		node.Size,
		node.Metadata,
		node.CreatedTimestamp,
		node.UpdatedTimestamp,
	)

	if err != nil {
		return fmt.Errorf("failed to create node: %w", err)
	}

	return nil
}

// Update updates an existing node
func (r *NodeRepositoryImpl) Update(node *models.Node) error {
	stmt, err := r.manager.GetStatement(stmtNodeUpdate)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(
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
		node.Access,
		node.Display,
		node.Order,
		node.Content,
		node.ContentCompiled,
		node.Metadata,
		node.UpdatedTimestamp,
		node.Id,
	)

	if err != nil {
		return fmt.Errorf("failed to update node: %w", err)
	}

	return nil
}

// Delete deletes a node
func (r *NodeRepositoryImpl) Delete(nodeId types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtNodeDelete)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(nodeId)
	if err != nil {
		return fmt.Errorf("failed to delete node: %w", err)
	}

	return nil
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

	// Prepare the search query for MySQL FULLTEXT
	// Clean the query for safety
	cleanQuery := strings.TrimSpace(query)
	if len(cleanQuery) < 2 {
		return []*models.NodeSearchResult{}, nil
	}

	var stmtKey string
	if includeContent {
		stmtKey = stmtNodeSearchContent
	} else {
		stmtKey = stmtNodeSearchFulltext
	}

	stmt, err := r.manager.GetStatement(stmtKey)
	if err != nil {
		return nil, err
	}

	var rows *sql.Rows
	if includeContent {
		// For content search, we need the query for MATCH, for LOCATE (snippet), userId, and limit
		rows, err = stmt.Query(cleanQuery, strings.ToLower(cleanQuery), userId, cleanQuery, limit)
	} else {
		// For fulltext search: query for MATCH, userId, query for MATCH again, and limit
		rows, err = stmt.Query(cleanQuery, userId, cleanQuery, limit)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to execute fulltext search: %w", err)
	}
	defer rows.Close()

	results := make([]*models.NodeSearchResult, 0)
	for rows.Next() {
		var result models.NodeSearchResult
		err := rows.Scan(
			&result.Id,
			&result.UserId,
			&result.ParentId,
			&result.Name,
			&result.Description,
			&result.Tags,
			&result.Role,
			&result.Icon,
			&result.Relevance,
			&result.ContentSnippet,
			&result.CreatedTimestamp,
			&result.UpdatedTimestamp,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan search result: %w", err)
		}
		results = append(results, &result)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating search results: %w", err)
	}

	return results, nil
}
