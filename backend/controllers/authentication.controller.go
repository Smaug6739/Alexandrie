package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/services"
	"crypto/rand"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController interface {
	Login(c *gin.Context) (int, any)
	RefreshSession(c *gin.Context) (int, any)
}
type AuthControllerImpl struct {
	Controller
	auth_service services.AuthService
	user_service services.UserService
}

func NewAuthController(app *app.App) AuthController {
	return &AuthControllerImpl{
		auth_service: services.NewAuthService(app.DB),
		user_service: services.NewUserService(app.DB),
		Controller: Controller{
			app: app,
		},
	}
}

type AuthClaims struct {
	Username string `form:"username" binding:"required"`
	Password string `form:"password" binding:"required"`
}

func (dc *AuthControllerImpl) Login(c *gin.Context) (int, any) {
	var authClaims AuthClaims
	if err := c.ShouldBind(&authClaims); err != nil {
		return http.StatusBadRequest, err
	}
	user, err := dc.user_service.GetUserByUsername(authClaims.Username)
	if user == nil || err != nil {
		return 401, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(authClaims.Password)); err != nil {
		return 401, errors.New("invalid credentials")
	}
	tokenString, err := dc.signAccessToken(user)
	if err != nil {
		return 500, errors.New("failed to sign token")
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

	if _, err := dc.auth_service.CreateSession(&session); err != nil {
		return 500, errors.New("failed to create session")
	}

	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(dc.app.Config.Auth.RefreshTokenExpiry).Seconds()), "/", "localhost", false, true)
	user.Password = ""
	return 200, user

}

func (dc *AuthControllerImpl) RefreshSession(c *gin.Context) (int, any) {
	// Get the refresh token from the cookie
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		return 401, errors.New("no refresh token provided")
	}
	session, err := dc.auth_service.GetSession(refreshToken)
	if err != nil {
		return 401, errors.New("invalid refresh token")
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		return 401, errors.New("refresh token expired")
	}
	// Generate a new access token
	user, err := dc.user_service.GetUserById(session.UserId)
	if user == nil || err != nil {
		return 500, errors.New("failed to get user")
	}
	tokenString, err := dc.signAccessToken(user)
	if err != nil {
		return 500, errors.New("failed to sign token")
	}
	// Update the session
	session.RefreshToken = signRefreshToken()
	session.ExpireToken = time.Now().Add(time.Duration(dc.app.Config.Auth.RefreshTokenExpiry * int(time.Second))).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()
	if _, err = dc.auth_service.UpdateSession(&session); err != nil {
		return 500, errors.New("failed to update session")
	}

	c.SetCookie("Authorization", tokenString, dc.app.Config.Auth.AccessTokenExpiry, "/", "localhost", false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, dc.app.Config.Auth.RefreshTokenExpiry, "/", "localhost", false, true)

	return 200, "Session refreshed successfully."

}

func (dc *AuthControllerImpl) signAccessToken(user *models.User) (string, error) {
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
