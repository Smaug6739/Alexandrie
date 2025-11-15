package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"errors"
	"time"
)

type NodeService interface {
	GetAllNodes(userId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole) ([]*models.Node, error)
	GetSharedNodes(userId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole) ([]*models.Node, error)
	GetAllNodeBackup(userId types.Snowflake) ([]*models.Node, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	GetPublicNode(nodeId types.Snowflake) (*models.Node, error)
	GetNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (map[string]interface{}, error)
	CreateNode(node *models.Node, userId types.Snowflake) (*models.Node, error)
	UpdateNode(nodeId types.Snowflake, node *models.Node, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (*models.Node, error)
	DeleteNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error
}

type nodeService struct {
	nodeRepo   repositories.NodeRepository
	permRepo   repositories.PermissionRepository
	snowflake  *utils.Snowflake
}

func NewNodeService(nodeRepo repositories.NodeRepository, permRepo repositories.PermissionRepository, snowflake *utils.Snowflake) NodeService {
	return &nodeService{
		nodeRepo:  nodeRepo,
		permRepo:  permRepo,
		snowflake: snowflake,
	}
}

func (s *nodeService) GetAllNodes(userId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole) ([]*models.Node, error) {
	if connectedUserId != userId && connectedUserRole != permissions.RoleAdministrator {
		return nil, errors.New("unauthorized")
	}
	return s.nodeRepo.GetAll(userId)
}

func (s *nodeService) GetSharedNodes(userId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole) ([]*models.Node, error) {
	if connectedUserId != userId && connectedUserRole != permissions.RoleAdministrator {
		return nil, errors.New("unauthorized")
	}
	return s.nodeRepo.GetShared(userId)
}

func (s *nodeService) GetAllNodeBackup(userId types.Snowflake) ([]*models.Node, error) {
	return s.nodeRepo.GetAllForBackup(userId)
}

func (s *nodeService) GetUserUploadsSize(userId types.Snowflake) (int64, error) {
	return s.nodeRepo.GetUserUploadsSize(userId)
}

func (s *nodeService) GetPublicNode(nodeId types.Snowflake) (*models.Node, error) {
	return s.nodeRepo.GetPublic(nodeId)
}

func (s *nodeService) GetNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (map[string]interface{}, error) {
	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, err
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionRead)
	if !allowed || err != nil {
		return nil, errors.New("unauthorized")
	}

	perms, err := s.permRepo.GetByNode(nodeId)
	if err != nil {
		return nil, err
	}

	filteredPerms := []*models.Permission{}
	for _, p := range perms {
		if p.UserId == connectedUserId || dbNode.UserId == connectedUserId {
			filteredPerms = append(filteredPerms, p)
		}
	}

	return map[string]interface{}{
		"node":        dbNode,
		"permissions": filteredPerms,
	}, nil
}

func (s *nodeService) CreateNode(node *models.Node, userId types.Snowflake) (*models.Node, error) {
	escapedHTMLContent := utils.EscapeHTML(node.ContentCompiled)
	
	description := ""
	if node.Description != nil {
		description = *node.Description
	}

	createdNode := &models.Node{
		Id:               s.snowflake.Generate(),
		ParentId:         node.ParentId,
		UserId:           userId,
		Name:             node.Name,
		Description:      &description,
		Role:             node.Role,
		Tags:             node.Tags,
		Thumbnail:        node.Thumbnail,
		Theme:            node.Theme,
		Icon:             node.Icon,
		Color:            node.Color,
		Accessibility:    node.Accessibility,
		Access:           node.Access,
		Display:          node.Display,
		Order:            node.Order,
		Content:          node.Content,
		ContentCompiled:  &escapedHTMLContent,
		Size:             node.Size,
		Metadata:         node.Metadata,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Create(createdNode); err != nil {
		return nil, err
	}
	return createdNode, nil
}

func (s *nodeService) UpdateNode(nodeId types.Snowflake, node *models.Node, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (*models.Node, error) {
	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, err
	}

	allowed, level, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionUpdate)
	if !allowed && (dbNode.Access < 2 || *dbNode.Accessibility != 3) {
		return nil, errors.New("unauthorized")
	}

	if dbNode.UserId != connectedUserId && level < permissions.PermOwner {
		node.ParentId = dbNode.ParentId
		node.UserId = dbNode.UserId
		node.Accessibility = dbNode.Accessibility
		node.Access = dbNode.Access
	}

	escapedHTMLContent := utils.EscapeHTML(node.ContentCompiled)
	description := ""
	if node.Description != nil {
		description = *node.Description
	}

	updatedNode := &models.Node{
		Id:               nodeId,
		ParentId:         node.ParentId,
		UserId:           node.UserId,
		Name:             node.Name,
		Description:      &description,
		Role:             node.Role,
		Tags:             node.Tags,
		Thumbnail:        node.Thumbnail,
		Theme:            node.Theme,
		Icon:             node.Icon,
		Color:            node.Color,
		Accessibility:    node.Accessibility,
		Access:           node.Access,
		Display:          node.Display,
		Order:            node.Order,
		Content:          node.Content,
		ContentCompiled:  &escapedHTMLContent,
		Metadata:         node.Metadata,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Update(updatedNode); err != nil {
		return nil, err
	}
	return updatedNode, nil
}

func (s *nodeService) DeleteNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error {
	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return err
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionDelete)
	if !allowed || err != nil {
		return errors.New("unauthorized")
	}

	return s.nodeRepo.Delete(nodeId)
}
