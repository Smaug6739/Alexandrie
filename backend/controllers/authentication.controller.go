package controllers

import (
	"alexandrie/app"
	"alexandrie/types"
	"alexandrie/utils"
	"errors"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AuthController interface {
	GetSessions(c *gin.Context) (int, any)
	RefreshSession(c *gin.Context) (int, any)
	DeleteSession(c *gin.Context) (int, any)

	Login(c *gin.Context) (int, any)
	RequestResetPassword(c *gin.Context) (int, any)
	ResetPassword(c *gin.Context) (int, any)
	Logout(c *gin.Context) (int, any)
	LogoutAllDevices(c *gin.Context) (int, any)

	VerifyTOTP(c *gin.Context) (int, any)
	RequestTOTPActivation(c *gin.Context) (int, any)
	ConfirmTOTPActivation(c *gin.Context) (int, any)
	DisableTOTP(c *gin.Context) (int, any)
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

	if disabled := os.Getenv("CONFIG_DISABLE_NATIVE_LOGIN"); disabled == "true" {
		return http.StatusForbidden, errors.New("native login is disabled")
	}

	var authClaims AuthClaims
	if err := c.ShouldBind(&authClaims); err != nil {
		return http.StatusBadRequest, err
	}

	user, session, err := ctr.app.Services.Auth.Login(authClaims.Username, authClaims.Password, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		return http.StatusUnauthorized, err
	}
	if user.TotpEnabled && session == nil {
		return http.StatusAccepted, gin.H{
			"message": "2FA_REQUIRED",
			"user_id": user.Id,
		}
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

type VerifyTOTPClaims struct {
	UserId types.Snowflake `json:"user_id" binding:"required"`
	Code   string          `json:"code" binding:"required"`
}

// VerifyTOTP
// @Summary Verify TOTP code and login
// @Method POST
// @Router /auth/totp [post]
// @Security TOTP code
// @Success 200 {object} Success([]models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) VerifyTOTP(c *gin.Context) (int, any) {
	var claims VerifyTOTPClaims
	if err := c.ShouldBindJSON(&claims); err != nil {
		return http.StatusBadRequest, err
	}

	user, session, err := ctr.app.Services.Auth.VerifyTOTPAndLogin(claims.UserId, claims.Code, c.ClientIP(), c.Request.UserAgent())
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

// RequestTOTPActivation
// @Summary Generate TOTP secret and QR Code URL
// @Method POST
// @Router /auth/2fa/request [post]
// @Security Session validation
// @Success 200 {object} Success
// @Failure 400 {object} Error
func (ctr *Controller) RequestTOTPActivation(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	user, err := ctr.app.Services.User.GetUserById(c.Request.Context(), userId)
	if err != nil || user == nil {
		return http.StatusBadRequest, errors.New("user not found")
	}

	secret, qrCodeURL, err := ctr.app.Services.Auth.GenerateTOTPSecret(user)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, gin.H{
		"secret":      secret,
		"qr_code_url": qrCodeURL,
	}
}

// ConfirmTOTPActivation
// @Summary Validate and activate 2FA definitively
// @Method POST
// @Router /auth/2fa/confirm [post]
// @Security Session validation
// @Param secret body string true "The TOTP secret generated in the previous step"
// @Param code body string true "The 6-digit code generated by the authentication app"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) ConfirmTOTPActivation(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	var data struct {
		Secret string `json:"secret" binding:"required"`
		Code   string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		return http.StatusBadRequest, err
	}

	if err := ctr.app.Services.Auth.EnableTOTP(userId, data.Secret, data.Code); err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "Success."
}

// DisableTOTP
// @Summary Disable TOTP for the user
// @Method POST
// @Router /auth/2fa/disable [post]
// @Security Code validation
// @Param code body string true "The 6-digit code generated by the authentication app"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) DisableTOTP(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	var data struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		return http.StatusBadRequest, err
	}

	if err := ctr.app.Services.Auth.DisableTOTP(userId, data.Code); err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "2FA disabled successfully."
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

// Close session
// @Summary Close a specific session
// @Method POST
// @Router /auth/sessions/close [post]
// @Security Session validation
// @Param session_id body string true "Session ID to close"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
func (ctr *Controller) DeleteSession(c *gin.Context) (int, any) {
	sessionId, err := utils.GetTargetId(c, c.Param("sessionId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusBadRequest, err
	}

	err = ctr.app.Services.Session.DeleteSession(sessionId, userId)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to delete session")
	}

	return http.StatusOK, "Session closed successfully."
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
