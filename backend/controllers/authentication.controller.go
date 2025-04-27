package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
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
	Logout(c *gin.Context) (int, any)
}

func NewAuthController(app *app.App) AuthController {
	go func() {
		for {
			deleteOldSessionsAndLogs(app)
			time.Sleep(1 * time.Hour) // Sleep for 1 hour
		}
	}()
	return &Controller{app: app}
}

// Login
// @Summary Login
// @Method GET
// @Router /auth [get]
// @Security Credentials
// @Success 200 {object} Success([]models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
type AuthClaims struct {
	Username string `form:"username" binding:"required"`
	Password string `form:"password" binding:"required"`
}

func (ctr *Controller) Login(c *gin.Context) (int, any) {
	var authClaims AuthClaims
	if err := c.ShouldBind(&authClaims); err != nil {
		return http.StatusBadRequest, err
	}
	user, err := ctr.app.Services.User.GetUserByUsername(authClaims.Username)
	if user == nil || err != nil {
		return http.StatusUnauthorized, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(authClaims.Password)); err != nil {
		return http.StatusUnauthorized, errors.New("invalid credentials")
	}
	tokenString, err := ctr.signAccessToken(user)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to sign token")
	}

	// Create a new session
	session := models.Session{
		Id:                   ctr.app.Snowflake.Generate(),
		UserId:               user.Id,
		RefreshToken:         signRefreshToken(),
		ExpireToken:          time.Now().Add(time.Duration(ctr.app.Config.Auth.RefreshTokenExpiry * int(time.Second))).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}

	if _, err := ctr.app.Services.Session.CreateSession(&session); err != nil {
		return http.StatusInternalServerError, errors.New("failed to create session")
	}

	c.SetCookie("Authorization", tokenString, ctr.app.Config.Auth.AccessTokenExpiry, "/", os.Getenv("COOKIE_DOMAIN"), false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(ctr.app.Config.Auth.RefreshTokenExpiry).Seconds()), "/", os.Getenv("COOKIE_DOMAIN"), false, true)
	user.Password = ""

	go func() {
		ctr.app.Services.Log.CreateConnectionLog(&models.Log{
			Id:        ctr.app.Snowflake.Generate(),
			UserId:    user.Id,
			IpAddr:    c.ClientIP(),
			Timestamp: time.Now().UnixMilli(),
			Type:      "login",
			Location:  ctr.app.Services.Log.GetLocationFromIp(c.ClientIP()),
			UserAgent: c.Request.UserAgent(),
		})
	}()
	return http.StatusOK, user
}

// RefreshSession
// @Summary Refresh session
// @Method GET
// @Router /auth/refresh [get]
// @Security Session validation
// @Success 200 {object} Success([]models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) RefreshSession(c *gin.Context) (int, any) {
	// Get the refresh token from the cookie
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		return http.StatusUnauthorized, errors.New("no refresh token provided")
	}
	session, err := ctr.app.Services.Session.GetSession(refreshToken)
	if err != nil {
		return http.StatusUnauthorized, errors.New("invalid refresh token")
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		return http.StatusUnauthorized, errors.New("refresh token expired")
	}
	// Generate a new access token
	user, err := ctr.app.Services.User.GetUserById(session.UserId)
	if user == nil || err != nil {
		return http.StatusInternalServerError, errors.New("failed to get user")
	}
	tokenString, err := ctr.signAccessToken(user)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to sign token")
	}
	// Update the session
	session.RefreshToken = signRefreshToken()
	session.ExpireToken = time.Now().Add(time.Duration(ctr.app.Config.Auth.RefreshTokenExpiry * int(time.Second))).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()
	if _, err = ctr.app.Services.Session.UpdateSession(&session); err != nil {
		return http.StatusInternalServerError, errors.New("failed to update session")
	}

	c.SetCookie("Authorization", tokenString, ctr.app.Config.Auth.AccessTokenExpiry, "/", os.Getenv("COOKIE_DOMAIN"), false, true)
	c.SetCookie("RefreshToken", session.RefreshToken, ctr.app.Config.Auth.RefreshTokenExpiry, "/", os.Getenv("COOKIE_DOMAIN"), false, true)

	return http.StatusOK, "Session refreshed successfully."
}

// Logout
// @Summary Logout
// @Method POST
// @Router /auth/logout [post]
// @Security Session validation
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) Logout(c *gin.Context) (int, any) {
	// Get the refresh token from the cookie
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		return http.StatusUnauthorized, errors.New("no refresh token provided")
	}
	session, err := ctr.app.Services.Session.GetSession(refreshToken)
	if err != nil {
		return http.StatusUnauthorized, errors.New("invalid refresh token")
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		return http.StatusUnauthorized, errors.New("refresh token expired")
	}
	if err = ctr.app.Services.Session.DeleteSession(session.Id); err != nil {
		return http.StatusInternalServerError, errors.New("failed to delete session")
	}
	c.SetCookie("Authorization", "", -1, "/", os.Getenv("COOKIE_DOMAIN"), false, true)
	c.SetCookie("RefreshToken", "", -1, "/", os.Getenv("COOKIE_DOMAIN"), false, true)
	return http.StatusOK, "Logged out successfully."
}

func (ctr *Controller) signAccessToken(user *models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  strconv.FormatUint(uint64(user.Id), 10),                                                                   // Subject (user identifier)
		"iss":  "alexandrie",                                                                                              // Issuer
		"exp":  time.Now().Add(time.Duration(time.Second * time.Duration(ctr.app.Config.Auth.RefreshTokenExpiry))).Unix(), // Expiration time
		"iat":  time.Now().Unix(),                                                                                         // Issued at
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

func deleteOldSessionsAndLogs(app *app.App) {
	err := app.Services.Log.DeleteOldLogs()
	if err != nil {
		fmt.Println("❌ Error deleting old logs:", err)
	} else {
		fmt.Println("✅ Old logs deleted successfully.")
	}
	err = app.Services.Session.DeleteOldSessions()
	if err != nil {
		fmt.Println("❌ Error deleting old sessions:", err)
	} else {
		fmt.Println("✅ Old sessions deleted successfully.")
	}
}
