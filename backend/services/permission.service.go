package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"net/url"
	"strings"
	"time"
)

type PermissionService interface {
	GetNodePermissions(ctx context.Context, nodeId types.Snowflake, recursive bool) ([]*models.Permission, error)
	GetNodeInvitations(ctx context.Context, nodeId types.Snowflake) ([]*models.NodeInvitation, error)
	GetPermission(id types.Snowflake) (*models.Permission, error)
	HasPermission(userId, nodeId types.Snowflake, required int) (bool, int)
	CreatePermission(ctx context.Context, nodeId, userId types.Snowflake, permission int) (*models.Permission, error)
	UpdatePermission(ctx context.Context, id types.Snowflake, permission int) error
	DeletePermission(ctx context.Context, id types.Snowflake) error
	CreateNodeInvitation(ctx context.Context, nodeId types.Snowflake, permissionLevel int) (*models.NodeInvitation, error)
	DeleteNodeInvitation(ctx context.Context, id types.Snowflake) error
	JoinNodeInvitation(ctx context.Context, input string) (*models.Permission, *models.Node, error)
}

type permissionService struct {
	permRepo       repositories.PermissionRepository
	nodeRepo       repositories.NodeRepository
	invitationRepo repositories.NodeInvitationRepository
	snowflake      *snowflake.Snowflake
	access         permissions.AccessGuard
}

func NewPermissionService(permRepo repositories.PermissionRepository, nodeRepo repositories.NodeRepository, invitationRepo repositories.NodeInvitationRepository, snowflake *snowflake.Snowflake, access permissions.AccessGuard) PermissionService {
	return &permissionService{
		permRepo:       permRepo,
		nodeRepo:       nodeRepo,
		invitationRepo: invitationRepo,
		snowflake:      snowflake,
		access:         access,
	}
}

func (s *permissionService) GetNodePermissions(ctx context.Context, nodeId types.Snowflake, recursive bool) ([]*models.Permission, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if _, err = s.access.RequireNodeAction(actor, nodeId, permissions.ActionManagePermissions); err != nil {
		return nil, err
	}

	if recursive {
		return s.permRepo.GetByNodeRecursive(nodeId)
	}
	return s.permRepo.GetByNode(nodeId)
}

func (s *permissionService) GetNodeInvitations(ctx context.Context, nodeId types.Snowflake) ([]*models.NodeInvitation, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if _, err = s.access.RequireNodeAction(actor, nodeId, permissions.ActionManagePermissions); err != nil {
		return nil, err
	}

	return s.invitationRepo.GetByNode(nodeId)
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

	if permission < int(permissions.PermRead) || permission > int(permissions.PermAdmin) {
		return nil, fmt.Errorf("invalid permission level")
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

	if permission < int(permissions.PermRead) || permission > int(permissions.PermAdmin) {
		return fmt.Errorf("invalid permission level")
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

// Invitation system

func (s *permissionService) CreateNodeInvitation(ctx context.Context, nodeId types.Snowflake, permissionLevel int) (*models.NodeInvitation, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}

	if permissionLevel < int(permissions.PermRead) || permissionLevel > int(permissions.PermAdmin) {
		return nil, fmt.Errorf("invalid invitation permission level")
	}

	if _, err = s.access.RequireNodeAction(actor, nodeId, permissions.ActionManagePermissions); err != nil {
		return nil, err
	}

	for attempt := 0; attempt < 10; attempt++ {
		invitation := &models.NodeInvitation{
			Id:               s.snowflake.Generate(),
			InvitationCode:   generateInvitationCode(6),
			PermissionLevel:  permissionLevel,
			NodeId:           nodeId,
			CreatedTimestamp: time.Now().UnixMilli(),
		}

		created, err := s.invitationRepo.Create(invitation)
		if err == nil {
			return created, nil
		}

		if !isDuplicateInvitationError(err) {
			return nil, err
		}
	}

	return nil, fmt.Errorf("failed to generate unique invitation code")
}

func (s *permissionService) DeleteNodeInvitation(ctx context.Context, id types.Snowflake) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}

	invitation, err := s.invitationRepo.GetByID(id)
	if err != nil {
		return err
	}
	if invitation == nil {
		return permissions.ErrNotFound
	}

	if _, err = s.access.RequireNodeAction(actor, invitation.NodeId, permissions.ActionManagePermissions); err != nil {
		return err
	}

	return s.invitationRepo.Delete(id)
}

func (s *permissionService) JoinNodeInvitation(ctx context.Context, input string) (*models.Permission, *models.Node, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, nil, err
	}

	code, err := parseInvitationCode(input)
	if err != nil {
		return nil, nil, permissions.ErrNotFound
	}

	invitation, err := s.invitationRepo.GetByCode(code)
	if err != nil {
		return nil, nil, err
	}
	if invitation == nil {
		return nil, nil, permissions.ErrNotFound
	}

	node, err := s.nodeRepo.GetByID(invitation.NodeId)
	if err != nil {
		return nil, nil, err
	}
	if node == nil {
		return nil, nil, permissions.ErrNotFound
	}

	existingPerm, err := s.permRepo.GetByNodeAndUser(invitation.NodeId, actor.UserID)
	if err != nil {
		return nil, nil, err
	}

	if existingPerm != nil {
		if existingPerm.Permission >= invitation.PermissionLevel {
			return existingPerm, node, nil
		}

		existingPerm.Permission = invitation.PermissionLevel
		if err := s.permRepo.Update(existingPerm); err != nil {
			return nil, nil, err
		}
		return existingPerm, node, nil
	}

	perm := &models.Permission{
		Id:               s.snowflake.Generate(),
		NodeId:           invitation.NodeId,
		UserId:           actor.UserID,
		Permission:       invitation.PermissionLevel,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	if _, err := s.permRepo.Create(perm); err != nil {
		return nil, nil, err
	}

	return perm, node, nil
}

func isDuplicateInvitationError(err error) bool {
	if err == nil {
		return false
	}
	message := strings.ToLower(err.Error())
	return strings.Contains(message, "duplicate") || strings.Contains(message, "unique")
}

func generateInvitationCode(length int) string {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	result := make([]byte, length)
	for index := range result {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		result[index] = alphabet[n.Int64()]
	}
	return string(result)
}

func parseInvitationCode(input string) (string, error) {
	trimmed := strings.TrimSpace(input)
	if trimmed == "" {
		return "", fmt.Errorf("empty invitation code")
	}

	if parsedURL, err := url.Parse(trimmed); err == nil && parsedURL.Scheme != "" {
		if code := parsedURL.Query().Get("code"); code != "" {
			trimmed = code
		} else {
			segments := strings.Split(strings.Trim(parsedURL.Path, "/"), "/")
			if len(segments) > 0 {
				trimmed = segments[len(segments)-1]
			}
		}
	}

	trimmed = strings.ToUpper(strings.TrimSpace(trimmed))
	if len(trimmed) != 6 {
		return "", fmt.Errorf("invalid invitation code length")
	}

	for _, char := range trimmed {
		if !strings.ContainsRune("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", char) {
			return "", fmt.Errorf("invalid invitation code format")
		}
	}

	return trimmed, nil
}
