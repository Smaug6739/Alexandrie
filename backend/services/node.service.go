package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
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
	GetPublicNode(nodeId types.Snowflake) (*models.PublicNodeResponse, error)
	GetNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (map[string]interface{}, error)
	CreateNode(node *models.Node, userId types.Snowflake) (*models.Node, error)
	UpdateNode(nodeId types.Snowflake, node *models.Node, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) (*models.Node, error)
	DeleteNode(nodeId types.Snowflake, connectedUserId types.Snowflake, connectedUserRole permissions.UserRole, authorizer permissions.Authorizer) error
	SearchNodes(userId types.Snowflake, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error)
}

type nodeService struct {
	nodeRepo     repositories.NodeRepository
	permRepo     repositories.PermissionRepository
	minioService MinioService
	snowflake    *snowflake.Snowflake
}

func NewNodeService(nodeRepo repositories.NodeRepository, permRepo repositories.PermissionRepository, minioService MinioService, snowflake *snowflake.Snowflake) NodeService {
	return &nodeService{
		nodeRepo:     nodeRepo,
		permRepo:     permRepo,
		minioService: minioService,
		snowflake:    snowflake,
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

func (s *nodeService) GetPublicNode(nodeId types.Snowflake) (*models.PublicNodeResponse, error) {
	// Get the node if it or any ancestor is public
	node, err := s.nodeRepo.GetPublic(nodeId)
	if err != nil {
		return nil, err
	}
	if node == nil {
		return nil, nil
	}

	// For workspaces (role=1), categories (role=2), and documents with subdocs (role=3)
	// fetch ALL descendants recursively - they inherit public access
	var children []*models.Node
	if node.Role == 1 || node.Role == 2 || node.Role == 3 {
		children, err = s.nodeRepo.GetPublicDescendants(nodeId)
		if err != nil {
			return nil, err
		}
	}

	return &models.PublicNodeResponse{
		Node:     node,
		Children: children,
	}, nil
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

	if dbNode == nil {
		return errors.New("node not found")
	}

	allowed, _, err := authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionDelete)
	if !allowed || err != nil {
		return errors.New("unauthorized")
	}

	// Get all descendant resources (role=4) before deletion
	// This is necessary because ON DELETE CASCADE will remove them from DB
	// but we need to clean up their files in MinIO first
	resources, err := s.nodeRepo.GetDescendantResources(nodeId)
	if err != nil {
		// logger.Warn(fmt.Sprintf("Failed to get descendant resources for node %d: %v", nodeId, err))
		// Continue with deletion even if we can't get resources
		// This prevents blocking deletion due to MinIO issues
	}

	// Delete MinIO files for all descendant resources
	if len(resources) > 0 {
		if err := s.minioService.DeleteNodeFiles(resources); err != nil {
			// Log the error but continue with DB deletion
			// Orphaned files can be cleaned up by a background job later
			// logger.Warn(fmt.Sprintf("Failed to delete some MinIO files for node %d: %v", nodeId, err))
		}
	}

	// Now delete the node from DB (CASCADE will handle children)
	return s.nodeRepo.Delete(nodeId)
}

// SearchNodes performs a fulltext search on user's documents
func (s *nodeService) SearchNodes(userId types.Snowflake, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error) {
	return s.nodeRepo.SearchFulltext(userId, query, includeContent, limit)
}
