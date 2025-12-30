package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"errors"
	"time"
)

type PermissionService interface {
	GetNodePermissions(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) ([]*models.Permission, error)
	GetPermission(id types.Snowflake) (*models.Permission, error)
	HasPermission(userId, nodeId types.Snowflake, required int) (bool, int)
	CreatePermission(nodeId, userId types.Snowflake, permission int, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (*models.Permission, error)
	UpdatePermission(id types.Snowflake, permission int, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error
	DeletePermission(id types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error
}

type permissionService struct {
	permRepo  repositories.PermissionRepository
	nodeRepo  repositories.NodeRepository
	snowflake *snowflake.Snowflake
}

func NewPermissionService(permRepo repositories.PermissionRepository, nodeRepo repositories.NodeRepository, snowflake *snowflake.Snowflake) PermissionService {
	return &permissionService{
		permRepo:  permRepo,
		nodeRepo:  nodeRepo,
		snowflake: snowflake,
	}
}

func (s *permissionService) GetNodePermissions(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) ([]*models.Permission, error) {
	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, err
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionManagePermissions)
	if !allowed || err != nil {
		return nil, errors.New("unauthorized")
	}

	return s.permRepo.GetByNode(nodeId)
}

func (s *permissionService) GetPermission(id types.Snowflake) (*models.Permission, error) {
	return s.permRepo.GetByID(id)
}

func (s *permissionService) HasPermission(userId, nodeId types.Snowflake, required int) (bool, int) {
	return s.permRepo.HasPermission(userId, nodeId, required)
}

func (s *permissionService) CreatePermission(nodeId, userId types.Snowflake, permission int, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (*models.Permission, error) {
	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, err
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionManagePermissions)
	if !allowed || err != nil {
		return nil, errors.New("unauthorized")
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

func (s *permissionService) UpdatePermission(id types.Snowflake, permission int, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error {

	perm, err := s.permRepo.GetByID(id)
	if err != nil {
		return err
	}

	dbNode, err := s.nodeRepo.GetByID(perm.NodeId)
	if err != nil {
		return err
	}
	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionManagePermissions)
	if !allowed || err != nil {
		return errors.New("unauthorized")
	}

	updatedPerm := &models.Permission{
		Id:         id,
		Permission: permission,
	}
	return s.permRepo.Update(updatedPerm)
}

func (s *permissionService) DeletePermission(id types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error {
	perm, err := s.permRepo.GetByID(id)
	if err != nil {
		return err
	}

	dbNode, err := s.nodeRepo.GetByID(perm.NodeId)
	if err != nil {
		return err
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionManagePermissions)
	if (!allowed || err != nil) && perm.UserId != connectedUserId {
		return errors.New("unauthorized")
	}

	return s.permRepo.Delete(id)
}
