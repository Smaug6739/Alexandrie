package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"context"
	"time"
)

type PermissionService interface {
	GetNodePermissions(ctx context.Context, nodeId types.Snowflake) ([]*models.Permission, error)
	GetPermission(id types.Snowflake) (*models.Permission, error)
	HasPermission(userId, nodeId types.Snowflake, required int) (bool, int)
	CreatePermission(ctx context.Context, nodeId, userId types.Snowflake, permission int) (*models.Permission, error)
	UpdatePermission(ctx context.Context, id types.Snowflake, permission int) error
	DeletePermission(ctx context.Context, id types.Snowflake) error
}

type permissionService struct {
	permRepo  repositories.PermissionRepository
	nodeRepo  repositories.NodeRepository
	snowflake *snowflake.Snowflake
	access    permissions.AccessGuard
}

func NewPermissionService(permRepo repositories.PermissionRepository, nodeRepo repositories.NodeRepository, snowflake *snowflake.Snowflake, access permissions.AccessGuard) PermissionService {
	return &permissionService{
		permRepo:  permRepo,
		nodeRepo:  nodeRepo,
		snowflake: snowflake,
		access:    access,
	}
}

func (s *permissionService) GetNodePermissions(ctx context.Context, nodeId types.Snowflake) ([]*models.Permission, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if _, err = s.access.RequireNodeAction(actor, nodeId, permissions.ActionManagePermissions); err != nil {
		return nil, err
	}

	return s.permRepo.GetByNode(nodeId)
}

func (s *permissionService) GetPermission(id types.Snowflake) (*models.Permission, error) {
	return s.permRepo.GetByID(id)
}

func (s *permissionService) HasPermission(userId, nodeId types.Snowflake, required int) (bool, int) {
	return s.permRepo.HasPermission(userId, nodeId, required)
}

func (s *permissionService) CreatePermission(ctx context.Context, nodeId, userId types.Snowflake, permission int) (*models.Permission, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if _, err = s.access.RequireNodeAction(actor, nodeId, permissions.ActionManagePermissions); err != nil {
		return nil, err
	}

	perm := &models.Permission{
		Id:               s.snowflake.Generate(),
		NodeId:           nodeId,
		UserId:           userId,
		Permission:       permission,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	_, err = s.permRepo.Create(perm)
	if err != nil {
		return nil, err
	}
	return perm, nil
}

func (s *permissionService) UpdatePermission(ctx context.Context, id types.Snowflake, permission int) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}

	perm, err := s.permRepo.GetByID(id)
	if err != nil {
		return err
	}

	if _, err = s.access.RequireNodeAction(actor, perm.NodeId, permissions.ActionManagePermissions); err != nil {
		return err
	}

	updatedPerm := &models.Permission{
		Id:         id,
		Permission: permission,
	}
	return s.permRepo.Update(updatedPerm)
}

func (s *permissionService) DeletePermission(ctx context.Context, id types.Snowflake) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}

	perm, err := s.permRepo.GetByID(id)
	if err != nil {
		return err
	}

	if _, err = s.access.RequireNodeAction(actor, perm.NodeId, permissions.ActionManagePermissions); err != nil && perm.UserId != actor.UserID {
		return err
	}

	return s.permRepo.Delete(id)
}
