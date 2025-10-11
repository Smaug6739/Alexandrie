package middlewares

import (
	"alexandrie/permissions"
	"alexandrie/utils"

	"github.com/gin-gonic/gin"
)

func Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, ok := c.Get("user_role")
		if !ok {
			c.JSON(401, utils.Error("Invalid role in token"))
			c.Abort()
			return
		}
		if role != permissions.RoleAdministrator {
			c.JSON(401, utils.Error("Unauthorized"))
			c.Abort()
			return
		}
		c.Next()
	}

}
