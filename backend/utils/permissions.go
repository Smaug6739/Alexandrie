package utils

import (
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

func GetUserIdParam(param string, ctx *gin.Context) (int64, error) {
	if param == "" {
		return 0, errors.New("user ID parameter is empty")
	}
	if param != "@me" {
		id_param, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
		if err != nil {
			return 0, errors.New("invalid user ID parameter")
		}
		return id_param, nil
	}
	return GetUserIdCtx(ctx)
}

func GetUserIdCtx(ctx *gin.Context) (int64, error) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		return 0, errors.New("user ID not found in context")
	}
	id, ok := userId.(int64)
	if !ok {
		return 0, errors.ErrUnsupported
	}
	return id, nil
}

func SelfOrPermission(ctx *gin.Context, allowed int) (int64, error) {
	// Check if the c.Param("id") is "@me" or c.Param("id") is the same as the user ID in the context
	// If not, check if the user has the required permission
	// If one of the above is true, return the user ID from the context
	// Otherwise, return an error
	id_param, err := GetUserIdParam(ctx.Param("id"), ctx)
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
