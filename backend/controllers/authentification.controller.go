package controllers

import (
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/utils"
	"crypto/rand"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthClaims struct {
	Username string `form:"username"`
	Password string `form:"password"`
}

func (dc *Controller) Login(c *gin.Context) {
	var authClaims AuthClaims
	if err := c.ShouldBind(&authClaims); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error(err.Error()))
		return
	}
	if authClaims.Username == "" || authClaims.Password == "" {
		c.JSON(400, utils.Error("Invalid credentials."))
		return
	}
	user, err := dc.model.GetUserByUsername(authClaims.Username)
	if user == nil || err != nil {
		c.JSON(401, utils.Error("Invalid credentials."))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(authClaims.Password)); err != nil {
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
		ExpireToken:          time.Now().Add(time.Duration(dc.app.Config.Auth.RefreshTokenExpiry * int(time.Second))).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}

	if _, err := dc.model.CreateSession(&session); err != nil {
		c.JSON(500, utils.Error("Failed to create session."))
		return
	}

	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(dc.app.Config.Auth.RefreshTokenExpiry).Seconds()), "/", "localhost", false, true)

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
	session.ExpireToken = time.Now().Add(time.Duration(dc.app.Config.Auth.RefreshTokenExpiry * int(time.Second))).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()
	if _, err = dc.model.UpdateSession(&session); err != nil {
		c.JSON(500, utils.Error("Failed to update session."))
		return
	}

	c.SetCookie("Authorization", tokenString, dc.app.Config.Auth.AccessTokenExpiry, "/", "localhost", false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, dc.app.Config.Auth.RefreshTokenExpiry, "/", "localhost", false, true)
	c.JSON(200, utils.Success("Token refreshed."))

}

func (dc *Controller) signAccessToken(user models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  strconv.FormatInt(user.Id, 10),                                                                           // Subject (user identifier)
		"iss":  "alexandrie",                                                                                             // Issuer
		"exp":  time.Now().Add(time.Duration(time.Second * time.Duration(dc.app.Config.Auth.RefreshTokenExpiry))).Unix(), // Expiration time
		"iat":  time.Now().Unix(),                                                                                        // Issued at
		"role": strconv.Itoa(user.Role),
	})
	tokenString, err := claims.SignedString([]byte(os.Getenv("JWT_SECRET")))
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
