package utils

// Utility functions to extract information from the Gin context

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
	actor, ok := permissions.ActorFromContext(ctx.Request.Context())
	if !ok || actor.UserID == 0 {
		return 0, permissions.ErrUnauthorized
	}
	return actor.UserID, nil
}
