package middlewares

import (
	"alexandrie/permissions"
	"alexandrie/types"
	"alexandrie/utils"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AuthClaims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.Error("Bad access token."))
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Parse the token
		claims := AuthClaims{}
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrAbortHandler
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, utils.Error("Bad access token."))
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Set the token claims to the context
		user_id, err := strconv.ParseUint(claims.Subject, 10, 64)
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.Error("Invalid user ID"))
			c.Abort() // Stop further processing if unauthorized
			return
		}
		user_role, err := strconv.Atoi(claims.Role)
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.Error("Invalid user role"))
			c.Abort() // Stop further processing if unauthorized
			return
		}
		c.Set("user_id", types.Snowflake(user_id)) // Set user ID in context
		c.Set("user_role", permissions.UserRole(user_role))
		//c.Set("claims", claims)
		c.Next() // Proceed to the next handler if authorized
	}
}
