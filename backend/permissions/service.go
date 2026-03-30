package permissions

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
	"context"
	"errors"
)

type Actor struct {
	UserID types.Snowflake
	Role   UserRole
}

type actorContextKey string

const ACTOR_CTX_KEY actorContextKey = "actor"

func WithActor(ctx context.Context, actor Actor) context.Context {
	return context.WithValue(ctx, ACTOR_CTX_KEY, actor)
}

func ActorFromContext(ctx context.Context) (Actor, bool) {
	if ctx == nil {
		return Actor{}, false
	}
	actor, ok := ctx.Value(ACTOR_CTX_KEY).(Actor)
	return actor, ok
}

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
	ErrNotFound     = errors.New("not found")
)

type NodeDecision struct {
	Node  *models.Node
	Level NodePermissionLevel
	Owner bool
}

type AccessGuard interface {
	RequireNodeAction(actor Actor, nodeID types.Snowflake, action NodeAction) (NodeDecision, error)
	CheckNodeAction(actor Actor, node *models.Node, action NodeAction) (NodePermissionLevel, error)
	RequireUserAccess(actor Actor, targetID types.Snowflake) error
	IsAppAdmin(userRole UserRole) bool
}

type DefaultAccessGuard struct {
	nodeRepo repositories.NodeRepository
	permRepo repositories.PermissionRepository
}

func NewAccessGuard(nodeRepo repositories.NodeRepository, permRepo repositories.PermissionRepository) AccessGuard {
	return &DefaultAccessGuard{nodeRepo: nodeRepo, permRepo: permRepo}
}

// RequireNodeAction checks if the actor has the required permissions for the specified action on the node.
func (a *DefaultAccessGuard) RequireNodeAction(actor Actor, nodeID types.Snowflake, action NodeAction) (NodeDecision, error) {
	node, err := a.nodeRepo.GetByID(nodeID)
	if err != nil {
		return NodeDecision{}, err
	}
	if node == nil {
		return NodeDecision{}, ErrNotFound
	}

	level, err := a.CheckNodeAction(actor, node, action)
	if err != nil {
		return NodeDecision{Node: node, Level: level, Owner: actor.UserID == node.UserId}, err
	}

	return NodeDecision{Node: node, Level: level, Owner: actor.UserID == node.UserId}, nil
}

// CheckNodeAction checks the permission level of the actor for the specified action on the node.
func (a *DefaultAccessGuard) CheckNodeAction(actor Actor, node *models.Node, action NodeAction) (NodePermissionLevel, error) {
	if actor.UserID == 0 {
		return PermNone, ErrUnauthorized
	}

	// Case 1: Owner of the node
	if actor.UserID == node.UserId {
		return PermOwner, nil
	}
	// Case 2: Global app admin
	if a.IsAppAdmin(actor.Role) {
		return PermOwner, nil
	}
	// Case 3: Check in DB via PermissionRepository
	hasPermission, level := a.permRepo.HasPermission(actor.UserID, node.Id, int(action.RequiredLevel()))
	if hasPermission {
		return NodePermissionLevel(level), nil
	}

	return PermNone, ErrForbidden
}

// RequireUserAccess checks if the actor has access to the target user ID (either it's their own ID or they are an app admin).
func (a *DefaultAccessGuard) RequireUserAccess(actor Actor, targetID types.Snowflake) error {
	if actor.UserID == 0 {
		return ErrUnauthorized
	}

	if actor.UserID == targetID {
		return nil
	}

	if a.IsAppAdmin(actor.Role) {
		return nil
	}

	return ErrForbidden
}

func (a *DefaultAccessGuard) IsAppAdmin(userRole UserRole) bool {
	return userRole == RoleAdministrator
}
