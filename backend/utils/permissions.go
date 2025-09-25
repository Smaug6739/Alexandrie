package utils

import (
	"alexandrie/permissions"
	"alexandrie/types"
	"errors"
	"strconv"

	"github.com/gin-gonic/gin"
)

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
	id, ok := userId.(types.Snowflake)
	if !ok {
		return 0, errors.ErrUnsupported
	}
	return id, nil
}

// Return the user ID and user role from the context
func GetUserContext(ctx *gin.Context) (types.Snowflake, permissions.UserRole, error) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		return 0, 0, errors.New("user ID not found in context")
	}
	id, ok := userId.(types.Snowflake)
	if !ok {
		return 0, 0, errors.ErrUnsupported
	}
	role, exists := ctx.Get("user_role")
	if !exists {
		role = permissions.RoleNone
	}
	return id, role.(permissions.UserRole), nil
}
