package middlewares

import (
	"alexandrie/utils"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			c.JSON(http.StatusUnauthorized, utils.Error("Unauthorized"))
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Parse the token
		claims := utils.AuthClaims{}
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrAbortHandler
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			fmt.Println("Error parsing token:", err)
			c.JSON(http.StatusUnauthorized, utils.Error("Unauthorized"))
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Set the token claims to the context
		user_id, err := strconv.ParseInt(claims.Subject, 10, 64)
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
		c.Set("user_id", user_id)     // Set user ID in context
		c.Set("user_role", user_role) // Set user role in context
		c.Set("claims", claims)
		c.Next() // Proceed to the next handler if authorized
	}
}
