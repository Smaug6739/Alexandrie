package permissions

import (
	"alexandrie/models"
	"alexandrie/services"
	"alexandrie/types"
	"errors"
	"fmt"
)

type Authorizer interface {
	CanAccessNode(userID types.Snowflake, userRole UserRole, node *models.Node, action NodeAction) (bool, NodePermissionLevel, error)
	CanAccessUser(connectedID, targetID types.Snowflake, userRole UserRole) (bool, error)
	IsAppAdmin(userRole UserRole) bool
}

type DefaultAuthorizer struct {
	permService services.PermissionService
}

func NewAuthorizer(permService services.PermissionService) Authorizer {
	return &DefaultAuthorizer{permService: permService}
}

// Check access to a node resource
func (a *DefaultAuthorizer) CanAccessNode(userID types.Snowflake, userRole UserRole, node *models.Node, action NodeAction) (bool, NodePermissionLevel, error) {
	// Case 1: Owner of the node
	if userID == node.UserId {
		return true, PermOwner, nil
	}
	fmt.Println("Case 1 failed: not the owner")
	// Case 2: Global app admin
	if a.IsAppAdmin(userRole) {
		return true, PermOwner, nil
	}
	fmt.Println("Case 2 failed: not an app admin")
	// Case 3: Check in DB via PermissionService
	hasPermission, level := a.permService.HasPermission(userID, node.Id, int(action.RequiredLevel()))
	if hasPermission {
		return true, NodePermissionLevel(level), nil
	}
	fmt.Println("Case 3 failed: no sufficient permission in DB")
	return false, PermNone, errors.New("unauthorized")
}

// Check access to a user resource
func (a *DefaultAuthorizer) CanAccessUser(connectedID, targetID types.Snowflake, userRole UserRole) (bool, error) {
	if connectedID == targetID {
		return true, nil
	}

	// Here we need to check the global role from the context (via middleware or db)
	if a.IsAppAdmin(userRole) {
		return true, nil
	}

	return false, errors.New("unauthorized")
}

func (a *DefaultAuthorizer) IsAppAdmin(userRole UserRole) bool {
	return userRole == RoleAdministrator
}
