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

func GetIdParam(ctx *gin.Context, param string) (uint64, error) {
	if param == "" {
		return 0, errors.New("parameter is empty")
	}
	if param != "@me" {
		id_param, err := strconv.ParseUint(param, 10, 64)
		if err != nil {
			return 0, errors.New("invalid parameter")
		}
		return id_param, nil
	}
	return GetUserIdCtx(ctx)
}

func GetUserIdCtx(ctx *gin.Context) (uint64, error) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		return 0, errors.New("user ID not found in context")
	}
	id, ok := userId.(uint64)
	if !ok {
		return 0, errors.ErrUnsupported
	}
	return id, nil
}

func SelfOrPermission(ctx *gin.Context, allowed int, key ...string) (uint64, error) {
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

func RessourceAccess(ctx *gin.Context, targetId uint64) error {
	// Check if the connected user has access to the resource (userId == targetId) or if the user has the required permission (ADMINISTRATOR)
	userId, err := GetUserIdCtx(ctx)
	if err != nil {
		return err
	}
	if userId == targetId {
		return nil
	}
	role, exists := ctx.Get("user_role")
	if !exists {
		return errors.New("user role not found in context")
	}
	if CheckPermission(role.(int), ADMINISTRATOR) {
		return nil
	}
	return errors.New("unauthorized")
}
