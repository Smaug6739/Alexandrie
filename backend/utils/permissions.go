package utils

import (
	"alexandrie/permissions"
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

const (
	READ  = 1
	WRITE = 2
	ADMIN = 3
	OWNER = 4
)

// CheckPermission checks if the user has the required permission.
func CheckPermission(userRole, requiredRole permissions.UserRole) bool {
	return userRole&requiredRole == requiredRole
}

func CheckUserRequestPermission(ctx *gin.Context, requiredRole permissions.UserRole) bool {
	// Check if the user has the required permission
	role, exists := ctx.Get("user_role")
	if !exists {
		return false
	}
	if CheckPermission(role.(permissions.UserRole), requiredRole) {
		return true
	}
	return false
}

func GetTargetId(ctx *gin.Context, param string) (types.Snowflake, error) {
	if param == "" {
		return 0, errors.New("parameter is empty")
	}
	if param == "@me" {
		return GetUserIdCtx(ctx)
	}

	id_param, err := strconv.ParseUint(param, 10, 64)
	if err != nil {
		return 0, errors.New("invalid parameter")
	}
	return types.Snowflake(id_param), nil
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

// Return the user ID and user role from the context
func GetUserContext(ctx *gin.Context) (types.Snowflake, permissions.UserRole, error) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		return 0, 0, errors.New("user ID not found in context")
	}
	id, ok := userId.(uint64)
	if !ok {
		return 0, 0, errors.ErrUnsupported
	}
	role, exists := ctx.Get("user_role")
	if !exists {
		return 0, 0, errors.New("user role not found in context")
	}
	return types.Snowflake(id), role.(permissions.UserRole), nil
}

func SelfOrPermission(ctx *gin.Context, allowed permissions.UserRole) (types.Snowflake, error) {
	// Check if the c.Param("id") is "@me" or c.Param("id") is the same as the user ID in the context
	// If not, check if the user has the required permission
	// If one of the above is true, return the user ID from the context
	// Otherwise, return an error

	// --- 1. Get the target user ID
	targetUserId, err := GetTargetId(ctx, ctx.Param("userId"))
	if err != nil {
		return 0, err
	}
	// --- 2. Get the connected user ID
	connectedUserId, err := GetUserIdCtx(ctx)
	if err != nil {
		return 0, err
	}
	// --- 3. Check if the connected user is the target user => allow
	if targetUserId == connectedUserId {
		return targetUserId, nil
	}
	// --- 4. Check if the connected user is an app administrator => allow
	role, exists := ctx.Get("user_role")
	if !exists {
		return 0, errors.New("user role not found in context")
	}
	if CheckPermission(role.(permissions.UserRole), allowed) {
		return targetUserId, nil
	}
	return 0, errors.New("unauthorized")
}
