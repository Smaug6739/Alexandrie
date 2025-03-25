package middlewares

import (
	"Smaug6739/Alexandrie/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, _ := c.Get("claims")
		if claims == nil {
			c.JSON(401, utils.Error("Unauthorized"))
			c.Abort()
			return
		}

		mapClaims, ok := claims.(jwt.MapClaims)
		if !ok {
			c.JSON(401, utils.Error("Unauthorized"))
			c.Abort()
			return
		}
		role, ok := mapClaims["role"] // JWT stocke souvent les nombres sous forme de float64
		if !ok {
			c.JSON(401, utils.Error("Invalid role in token"))
			c.Abort()
			return
		}

		if role.(float64) != 2 {
			c.JSON(401, utils.Error("Unauthorized"))
			c.Abort()
			return
		}
		c.Next()
	}

}
