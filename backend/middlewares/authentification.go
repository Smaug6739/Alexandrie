package middlewares

import (
	"Smaug6739/Alexandrie/utils"
	"net/http"
	"os"

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
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrAbortHandler
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, utils.Error("Unauthorized"))
			c.Abort() // Stop further processing if unauthorized
			return
		}

		// Set the token claims to the context
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("claims", claims)
		} else {
			c.JSON(http.StatusUnauthorized, utils.Error("Unauthorized"))
			c.Abort()
			return
		}

		c.Next() // Proceed to the next handler if authorized
	}
}
