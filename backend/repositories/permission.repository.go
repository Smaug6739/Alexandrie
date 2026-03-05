package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type PermissionRepositoryImpl struct {
	db *sqlx.DB
}

type PermissionRepository interface {
	GetByID(permissionId types.Snowflake) (*models.Permission, error)
	GetByNode(nodeId types.Snowflake) ([]*models.Permission, error)
	GetByNodeAndUser(nodeId types.Snowflake, userId types.Snowflake) (*models.Permission, error)
	HasPermission(userId, nodeId types.Snowflake, required int) (bool, int)
	Create(permission *models.Permission) (*models.Permission, error)
	Update(permission *models.Permission) error
	Delete(permissionId types.Snowflake) error
}

func NewPermissionRepository(db *sqlx.DB) PermissionRepository {
	return &PermissionRepositoryImpl{db: db}
}

func (r *PermissionRepositoryImpl) GetByID(permissionId types.Snowflake) (*models.Permission, error) {
	var perm models.Permission
	err := r.db.Get(&perm, `
		SELECT id, node_id, user_id, permission, created_timestamp
		FROM permissions
		WHERE id = ?`, permissionId)
	if err != nil {
		return nil, fmt.Errorf("failed to get permission: %w", err)
	}
	return &perm, nil
}

func (r *PermissionRepositoryImpl) GetByNode(nodeId types.Snowflake) ([]*models.Permission, error) {
	var permissions []*models.Permission
	err := r.db.Select(&permissions, `
		SELECT id, node_id, user_id, permission, created_timestamp
		FROM permissions
		WHERE node_id = ?`, nodeId)
	if err != nil {
		return nil, fmt.Errorf("failed to query permissions: %w", err)
	}
	return permissions, nil
}

func (r *PermissionRepositoryImpl) GetByNodeAndUser(nodeId types.Snowflake, userId types.Snowflake) (*models.Permission, error) {
	var perm models.Permission
	err := r.db.Get(&perm, `
		SELECT id, node_id, user_id, permission, created_timestamp
		FROM permissions
		WHERE node_id = ? AND user_id = ?`, nodeId, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to get permission: %w", err)
	}
	return &perm, nil
}

func (r *PermissionRepositoryImpl) Create(permission *models.Permission) (*models.Permission, error) {
	_, err := r.db.NamedExec(`
		INSERT INTO permissions (id, node_id, user_id, permission, created_timestamp)
		VALUES (:id, :node_id, :user_id, :permission, :created_timestamp)`, permission)
	if err != nil {
		return nil, fmt.Errorf("failed to create permission: %w", err)
	}
	return permission, nil
}

func (r *PermissionRepositoryImpl) Update(permission *models.Permission) error {
	_, err := r.db.Exec(`
		UPDATE permissions
		SET permission = ?
		WHERE id = ?`, permission.Permission, permission.Id)
	if err != nil {
		return fmt.Errorf("failed to update permission: %w", err)
	}
	return nil
}

func (r *PermissionRepositoryImpl) Delete(permissionId types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM permissions WHERE id = ?`, permissionId)
	if err != nil {
		return fmt.Errorf("failed to delete permission: %w", err)
	}
	return nil
}

func (r *PermissionRepositoryImpl) HasPermission(userId, nodeId types.Snowflake, required int) (bool, int) {
	var perm sql.NullInt32
	r.db.QueryRow(`
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

	// Case 1: Explicit permission sufficient
	if perm.Valid && perm.Int32 >= int32(required) {
		return true, int(perm.Int32)
	}

	// Case 2: Not enough permissions → check if owner of an ancestor
	var owns int
	err := r.db.QueryRow(`
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
