package controllers

import (
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/utils"
	"crypto/rand"
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var refresh_token_expiration = 1000 * 60 * 1 // 2 minutes

func (dc *Controller) Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	if username == "" || password == "" {
		c.JSON(400, utils.Error("Invalid credentials."))
		return
	}
	user, err := dc.model.GetUserByUsername(username)
	if user == nil || err != nil {
		c.JSON(401, utils.Error("Invalid credentials."))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		c.JSON(401, utils.Error("Invalid credentials."))
		return
	}
	tokenString, err := dc.signAccessToken(*user)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(500, utils.Error("Failed to sign token."))
		return
	}

	// Create a new session
	session := models.Session{
		Id:                   dc.app.Snowflake.Generate(),
		UserId:               user.Id,
		RefreshToken:         signRefreshToken(),
		ExpireToken:          time.Now().Add(time.Duration(refresh_token_expiration * 1000000)).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}

	if _, err := dc.model.CreateSession(&session); err != nil {
		c.JSON(500, utils.Error("Failed to create session."))
		return
	}

	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true) // TODO: Replace with config
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(refresh_token_expiration).Seconds()), "/", "localhost", false, true)

	c.JSON(200, utils.Success(user))

}

func (dc *Controller) RefreshSession(c *gin.Context) {
	// Get the refresh token from the cookie
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		c.JSON(401, utils.Error("No refresh token provided."))
		return
	}
	session, err := dc.model.GetSession(refreshToken)
	if err != nil {
		c.JSON(401, utils.Error("Invalid refresh token."))
		return
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		c.JSON(401, utils.Error("Refresh token expired."))
		return
	}
	// Generate a new access token
	user, err := dc.model.GetUserById(session.UserId)
	if user == nil || err != nil {
		c.JSON(500, utils.Error("Failed to get user."))
		return
	}
	tokenString, err := dc.signAccessToken(*user)
	if err != nil {
		c.JSON(500, utils.Error("Failed to sign token."))
		return
	}
	// Update the session
	session.RefreshToken = signRefreshToken()
	session.ExpireToken = time.Now().Add(time.Duration(refresh_token_expiration)).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()
	if _, err = dc.model.UpdateSession(&session); err != nil {
		c.JSON(500, utils.Error("Failed to update session."))
		return
	}

	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true) // TODO: Replace with config
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(refresh_token_expiration).Seconds()), "/", "localhost", false, true)
	c.JSON(200, utils.Success("Token refreshed."))

}

func (dc *Controller) signAccessToken(user models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.Username,                           // Subject (user identifier)
		"iss": "alexandrie",                            // Issuer
		"aud": user.Role,                               // Audience (user role)
		"exp": time.Now().Add(time.Second * 15).Unix(), // Expiration time // TODO: Replace with config
		"iat": time.Now().Unix(),                       // Issued at
	})
	tokenString, err := claims.SignedString([]byte(os.Getenv("JWT_SECRET"))) // TODO: Replace with config
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Crypto create random string hex 64
func signRefreshToken() string {
	randBytes := make([]byte, 45)
	rand.Read(randBytes)
	return fmt.Sprintf("%x", randBytes)
}
