package controllers

import (
	"alexandrie/app"
	"alexandrie/utils"
	"errors"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AuthController interface {
	GetSessions(c *gin.Context) (int, any)
	Login(c *gin.Context) (int, any)
	RefreshSession(c *gin.Context) (int, any)
	RequestResetPassword(c *gin.Context) (int, any)
	ResetPassword(c *gin.Context) (int, any)
	Logout(c *gin.Context) (int, any)
	LogoutAllDevices(c *gin.Context) (int, any)
}

func NewAuthController(app *app.App) AuthController {

	return &Controller{app: app}
}

// GetSessions
// @Summary Get sessions of the logged-in user
// @Method GET
// @Router /auth/sessions [get]
// @Security Session validation
// @Success 200 {object} Success([]models.Session)
// @Failure 400 {object} Error
func (ctr *Controller) GetSessions(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	sessions, err := ctr.app.Services.Session.GetSessionsByUserId(userId)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to retrieve sessions")
	}

	return http.StatusOK, sessions
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

	user, session, err := ctr.app.Services.Auth.Login(authClaims.Username, authClaims.Password, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		return http.StatusUnauthorized, err
	}

	tokenString, err := ctr.app.Services.Auth.SignAccessToken(user, ctr.app.Config.Auth.AccessTokenExpiry)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to sign token")
	}

	secure := shouldUseSecureCookies()
	domain := getCookieDomain()
	c.SetCookie("Authorization", tokenString, ctr.app.Config.Auth.AccessTokenExpiry, "/", domain, secure, true)
	c.SetCookie("RefreshToken", session.RefreshToken, ctr.app.Config.Auth.RefreshTokenExpiry, "/", domain, secure, true)

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
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		return http.StatusUnauthorized, errors.New("no refresh token provided")
	}

	user, session, err := ctr.app.Services.Auth.RefreshSession(refreshToken)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	tokenString, err := ctr.app.Services.Auth.SignAccessToken(user, ctr.app.Config.Auth.AccessTokenExpiry)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to sign token")
	}

	secure := shouldUseSecureCookies()
	domain := getCookieDomain()
	c.SetCookie("Authorization", tokenString, ctr.app.Config.Auth.AccessTokenExpiry, "/", domain, secure, true)
	c.SetCookie("RefreshToken", session.RefreshToken, ctr.app.Config.Auth.RefreshTokenExpiry, "/", domain, secure, true)

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
	refreshToken, _ := c.Cookie("RefreshToken")
	ctr.app.Services.Auth.Logout(refreshToken)

	secure := shouldUseSecureCookies()
	domain := getCookieDomain()
	c.SetCookie("Authorization", "", -1, "/", domain, secure, true)
	c.SetCookie("RefreshToken", "", -1, "/", domain, secure, true)
	return http.StatusOK, "Logged out successfully."
}

// Logout all devices
// @Summary Logout all devices
// @Method POST
// @Router /auth/logout/all [post]
// @Security Session validation
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) LogoutAllDevices(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	if err := ctr.app.Services.Auth.LogoutAllDevices(userId); err != nil {
		return http.StatusInternalServerError, errors.New("failed to delete sessions")
	}

	secure := shouldUseSecureCookies()
	domain := getCookieDomain()
	c.SetCookie("Authorization", "", -1, "/", domain, secure, true)
	c.SetCookie("RefreshToken", "", -1, "/", domain, secure, true)
	return http.StatusOK, "Logged out from all devices successfully."
}

// Reset password
// @Summary Reset password
// @Method POST
// @Router /auth/reset [post]
// @Security Username -> send reset link
// @Param username body string true "Username"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) RequestResetPassword(c *gin.Context) (int, any) {
	var data struct {
		User string `json:"username" binding:"required"`
	}
	if err := c.ShouldBind(&data); err != nil {
		return http.StatusBadRequest, err
	}

	ctr.app.Services.Auth.RequestPasswordReset(data.User, ctr.app.MailClient)
	return http.StatusOK, "Job done."
}

// Reset password
// @Summary Reset password
// @Method POST
// @Router /auth/reset [post]
// @Security Reset token -> reset password
// @Param token body string true "Reset token"
// @Param password body string true "New password"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) ResetPassword(c *gin.Context) (int, any) {
	var data struct {
		Token    string `json:"token" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBind(&data); err != nil {
		return http.StatusBadRequest, err
	}

	if err := ctr.app.Services.Auth.ResetPassword(data.Token, data.Password); err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "Password reset successfully."
}

// Cookies security helpers

func shouldUseSecureCookies() bool {
	value := os.Getenv("ALLOW_UNSECURE")
	return !(value == "true" || value == "1")
}

func getCookieDomain() string {
	domain := os.Getenv("COOKIE_DOMAIN")
	if domain == "" {
		return ""
	}
	// Include leading dot for subdomains
	if domain[0] != '.' {
		domain = "." + domain
	}
	return domain
}
