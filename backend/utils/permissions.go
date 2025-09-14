package utils

import (
	"alexandrie/models"
	"alexandrie/services"
	"alexandrie/types"
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
)

// We define user roles as bit flags to allow for easy combination and checking of permissions.

const (
	ADMINISTRATOR = 1 << 1
	MANAGER       = 1 << 2
	MODERATOR     = 1 << 3
)

// CheckPermission checks if the user has the required permission.
func CheckPermission(userRole, requiredRole int) bool {
	return userRole&requiredRole == requiredRole
}

func CheckUserRequestPermission(ctx *gin.Context, requiredRole int) bool {
	// Check if the user has the required permission
	role, exists := ctx.Get("user_role")
	if !exists {
		return false
	}
	if CheckPermission(role.(int), requiredRole) {
		return true
	}
	return false
}

func GetIdParam(ctx *gin.Context, param string) (types.Snowflake, error) {
	if param == "" {
		return 0, errors.New("parameter is empty")
	}
	if param != "@me" {
		id_param, err := strconv.ParseUint(param, 10, 64)
		if err != nil {
			return 0, errors.New("invalid parameter")
		}
		return types.Snowflake(id_param), nil
	}
	return GetUserIdCtx(ctx)
}

func GetUserIdCtx(ctx *gin.Context) (types.Snowflake, error) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		return 0, errors.New("user ID not found in context")
	}
	id, ok := userId.(uint64)
	if !ok {
		return 0, errors.ErrUnsupported
	}
	return types.Snowflake(id), nil
}

func SelfOrPermission(ctx *gin.Context, allowed int, key ...string) (types.Snowflake, error) {
	// Check if the c.Param("id") is "@me" or c.Param("id") is the same as the user ID in the context
	// If not, check if the user has the required permission
	// If one of the above is true, return the user ID from the context
	// Otherwise, return an error
	search_key := "id"
	if len(key) > 0 {
		search_key = key[0]
	}
	id_param, err := GetIdParam(ctx, ctx.Param(search_key))
	if err != nil {
		return 0, err
	}
	userId, err := GetUserIdCtx(ctx)
	if err != nil {
		return 0, err
	}
	if id_param == userId {
		return id_param, nil
	}
	role, exists := ctx.Get("user_role")
	if !exists {
		return 0, errors.New("user role not found in context")
	}
	if id_param != userId && CheckPermission(role.(int), allowed) {
		return id_param, nil
	}
	return 0, errors.New("unauthorized")
}

func RessourceAccess(ctx *gin.Context, node *models.Node, permissionService services.PermissionService, permission int) (error, types.Snowflake) {
	// Check if the connected user has access to the resource (userId == targetId) or if the user has the required permission (app ADMINISTRATOR or node permission)

	// Check user is correctly authenticated
	userId, err := GetUserIdCtx(ctx)
	if err != nil {
		return err, 0
	}
	// Case 1: User is the owner of the resource
	if userId == node.UserId {
		return nil, userId
	}
	// Case 2: User is an app administrator
	role, exists := ctx.Get("user_role")
	if !exists {
		return errors.New("user role not found in context"), userId
	}
	if CheckPermission(role.(int), ADMINISTRATOR) {
		return nil, userId
	}
	// Case 3: User has the required permission on the resource
	hasPermission := permissionService.HasPermission(userId, node.Id, permission)

	if hasPermission {
		return nil, userId
	}

	return errors.New("unauthorized"), userId
}
