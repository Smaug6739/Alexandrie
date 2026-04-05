package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"context"
	"time"
)

type NodeService interface {
	GetAllNodes(ctx context.Context, userId types.Snowflake) ([]*models.Node, error)
	GetSharedNodes(ctx context.Context, userId types.Snowflake) ([]*models.Node, error)
	GetAllNodeBackup(userId types.Snowflake) ([]*models.Node, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	GetPublicNode(nodeId types.Snowflake) (*models.PublicNodeResponse, error)
	GetNode(ctx context.Context, nodeId types.Snowflake) (map[string]any, error)
	CreateNode(ctx context.Context, node *models.Node) (*models.Node, error)
	UpdateNode(ctx context.Context, nodeId types.Snowflake, node *models.Node) (*models.Node, error)
	DeleteNode(ctx context.Context, nodeId types.Snowflake) error
	SearchNodes(ctx context.Context, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error)
}

type nodeService struct {
	nodeRepo     repositories.NodeRepository
	permRepo     repositories.PermissionRepository
	minioService MinioService
	snowflake    *snowflake.Snowflake
	access       permissions.AccessGuard
}

func NewNodeService(nodeRepo repositories.NodeRepository, permRepo repositories.PermissionRepository, minioService MinioService, snowflake *snowflake.Snowflake, access permissions.AccessGuard) NodeService {
	return &nodeService{
		nodeRepo:     nodeRepo,
		permRepo:     permRepo,
		minioService: minioService,
		snowflake:    snowflake,
		access:       access,
	}
}

func (s *nodeService) GetAllNodes(ctx context.Context, userId types.Snowflake) ([]*models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if actor.UserID != userId && !s.access.IsAppAdmin(actor.Role) {
		return nil, permissions.ErrForbidden
	}
	return s.nodeRepo.GetAll(userId)
}

func (s *nodeService) GetSharedNodes(ctx context.Context, userId types.Snowflake) ([]*models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if actor.UserID != userId && !s.access.IsAppAdmin(actor.Role) {
		return nil, permissions.ErrForbidden
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

func (s *nodeService) GetNode(ctx context.Context, nodeId types.Snowflake) (map[string]any, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	decision, err := s.access.RequireNodeAction(actor, nodeId, permissions.ActionRead)
	if err != nil {
		return nil, err
	}

	perms, err := s.permRepo.GetByNode(nodeId)
	if err != nil {
		return nil, err
	}

	filteredPerms := []*models.Permission{}
	for _, p := range perms {
		if p.UserId == actor.UserID || decision.Node.UserId == actor.UserID {
			filteredPerms = append(filteredPerms, p)
		}
	}

	return map[string]any{
		"node":        decision.Node,
		"permissions": filteredPerms,
	}, nil
}

func (s *nodeService) CreateNode(ctx context.Context, node *models.Node) (*models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	escapedHTMLContent := utils.EscapeHTML(node.ContentCompiled)

	// Parent ID: Check if exists and user has permissions to create under it
	safeParentId := node.ParentId
	if node.ParentId != nil {
		parentNode, err := s.nodeRepo.GetByID(*node.ParentId)
		if err != nil {
			safeParentId = nil
		}
		if parentNode != nil {
			level, err := s.access.CheckNodeAction(actor, parentNode, permissions.ActionUpdate)
			if err != nil || level == permissions.PermNone {
				safeParentId = nil
			}
		}
	}

	createdNode := &models.Node{
		Id:               s.snowflake.Generate(),
		ParentId:         safeParentId,
		UserId:           actor.UserID,
		Name:             node.Name,
		Description:      node.Description,
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
		Size:             getNodeSize(node),
		Metadata:         node.Metadata,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Create(createdNode); err != nil {
		return nil, err
	}
	return createdNode, nil
}

func (s *nodeService) UpdateNode(ctx context.Context, nodeId types.Snowflake, node *models.Node) (*models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	dbNode, err := s.nodeRepo.GetByID(nodeId)
	if err != nil {
		return nil, err
	}
	if dbNode == nil {
		return nil, permissions.ErrNotFound
	}

	level, err := s.access.CheckNodeAction(actor, dbNode, permissions.ActionUpdate)
	if err != nil {
		if dbNode.Access < 2 || dbNode.Accessibility == nil || *dbNode.Accessibility != 3 {
			return nil, err
		}
	}

	if dbNode.UserId != actor.UserID && level < permissions.PermOwner {
		node.ParentId = dbNode.ParentId
		node.UserId = dbNode.UserId
		node.Accessibility = dbNode.Accessibility
		node.Access = dbNode.Access
	}

	// Parent ID: Check if exists and user has permissions to create under it
	safeParentId := node.ParentId
	if node.ParentId != nil {
		parentNode, err := s.nodeRepo.GetByID(*node.ParentId)
		if err != nil {
			safeParentId = nil
		}
		if parentNode != nil {
			parentLevel, err := s.access.CheckNodeAction(actor, parentNode, permissions.ActionUpdate)
			if err != nil || parentLevel == permissions.PermNone {
				safeParentId = nil
			}
		}
	}

	escapedHTMLContent := utils.EscapeHTML(node.ContentCompiled)
	description := ""
	if node.Description != nil {
		description = *node.Description
	}

	updatedNode := &models.Node{
		Id:               nodeId,
		ParentId:         safeParentId,
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
		Size:             getNodeSize(node),
		Metadata:         node.Metadata,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	if err := s.nodeRepo.Update(updatedNode); err != nil {
		return nil, err
	}
	return updatedNode, nil
}

func (s *nodeService) DeleteNode(ctx context.Context, nodeId types.Snowflake) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}

	decision, err := s.access.RequireNodeAction(actor, nodeId, permissions.ActionDelete)
	if err != nil {
		return err
	}

	// Get all descendant resources (role=4) before deletion
	// This is necessary because ON DELETE CASCADE will remove them from DB
	// but we need to clean up their files in MinIO first
	resources, err := s.nodeRepo.GetDescendantResources(decision.Node.Id)
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
	return s.nodeRepo.Delete(decision.Node.Id)
}

// SearchNodes performs a fulltext search on user's documents
func (s *nodeService) SearchNodes(ctx context.Context, query string, includeContent bool, limit int) ([]*models.NodeSearchResult, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	return s.nodeRepo.SearchFulltext(actor.UserID, query, includeContent, limit)
}

// ******************* Helper functions *******************

func getNodeSize(node *models.Node) *int64 {
	if node.Role == 4 && node.Size != nil {
		return node.Size
	}
	size := int64(len(*node.ContentCompiled) + len(*node.Content))
	return &size
}
