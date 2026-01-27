package controllers

import (
	"alexandrie/app"
	"alexandrie/utils"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type OIDCController interface {
	GetProviders(c *gin.Context) (int, any)
	Authorize(c *gin.Context) (int, any)
	Callback(c *gin.Context) (int, any)
	LinkProvider(c *gin.Context) (int, any)
	UnlinkProvider(c *gin.Context) (int, any)
	GetUserProviders(c *gin.Context) (int, any)
}

func NewOIDCController(app *app.App) OIDCController {
	return &Controller{
		app: app,
	}
}

// GetProviders returns available OIDC providers
// @Summary Get OIDC providers
// @Method GET
// @Router /auth/oidc/providers [get]
// @Success 200 {object} Success([]oidc.PublicProvider)
func (ctr *Controller) GetProviders(c *gin.Context) (int, any) {
	if !ctr.app.Services.OIDC.IsEnabled() {
		return http.StatusNotFound, errors.New("OIDC is not configured")
	}

	providers := ctr.app.Services.OIDC.GetProviders()
	return http.StatusOK, gin.H{
		"enabled":   true,
		"providers": providers,
	}
}

// Authorize initiates the OIDC authorization flow
// @Summary Start OIDC authorization - returns auth URL for frontend to redirect
// @Method GET
// @Router /auth/oidc/:provider/authorize [get]
// @Param provider path string true "Provider name"
// @Param redirect_uri query string false "Custom redirect URI (defaults to frontend callback)"
// @Success 200 {object} Success(AuthURLResponse)
// @Failure 400 {object} Error
func (ctr *Controller) Authorize(c *gin.Context) (int, any) {
	providerName := strings.ToLower(c.Param("provider"))
	if providerName == "" {
		return http.StatusBadRequest, errors.New("provider name is required")
	}

	// Get redirect URI - this should point to the FRONTEND callback
	redirectURI := c.Query("redirect_uri")
	if redirectURI == "" {
		return http.StatusBadRequest, errors.New("redirect_uri is required")
	}

	authURL, state, err := ctr.app.Services.OIDC.GenerateAuthURL(providerName, redirectURI, nil)
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Return the auth URL and state for the frontend to handle
	return http.StatusOK, gin.H{
		"auth_url":     authURL,
		"state":        state,
		"redirect_uri": redirectURI,
	}
}

// Callback handles the OIDC code exchange - called by frontend after receiving callback
// @Summary Exchange OIDC authorization code for session
// @Method POST
// @Router /auth/oidc/:provider/callback [post]
// @Param provider path string true "Provider name"
// @Param code body string true "Authorization code"
// @Param state body string true "State parameter"
// @Param redirect_uri body string true "Redirect URI used in authorization"
// @Success 200 {object} Success(User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
type OIDCCallbackRequest struct {
	Code        string `json:"code" binding:"required"`
	State       string `json:"state" binding:"required"`
	RedirectURI string `json:"redirect_uri" binding:"required"`
}

func (ctr *Controller) Callback(c *gin.Context) (int, any) {
	providerName := strings.ToLower(c.Param("provider"))

	var req OIDCCallbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return http.StatusBadRequest, err
	}

	// Validate state against service (one-time use) and get flow info
	stateData, err := ctr.app.Services.OIDC.ValidateState(req.State)
	if err != nil {
		return http.StatusUnauthorized, errors.New("invalid or expired state")
	}

	// Exchange code for user info
	userInfo, err := ctr.app.Services.OIDC.ExchangeCodeForUser(providerName, req.Code, req.RedirectURI)
	if err != nil {
		return http.StatusUnauthorized, errors.New("failed to exchange code: " + err.Error())
	}

	// Handle link flow - user is already logged in and wants to link provider
	if stateData.IsLink {
		if err := ctr.app.Services.OIDC.LinkProvider(stateData.UserID, providerName, userInfo.Sub); err != nil {
			return http.StatusBadRequest, err
		}

		return http.StatusOK, gin.H{
			"linked":   true,
			"provider": providerName,
		}
	}

	// Handle login flow - login or create user
	user, session, isNewLink, err := ctr.app.Services.OIDC.LoginOrCreate(providerName, userInfo, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		return http.StatusUnauthorized, err
	}

	// Sign access token
	tokenString, err := ctr.app.Services.Auth.SignAccessToken(user, ctr.app.Config.Auth.AccessTokenExpiry)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to sign token")
	}

	// Set auth cookies
	secure := shouldUseSecureCookies()
	domain := getCookieDomain()
	c.SetCookie("Authorization", tokenString, ctr.app.Config.Auth.AccessTokenExpiry, "/", domain, secure, true)
	c.SetCookie("RefreshToken", session.RefreshToken, ctr.app.Config.Auth.RefreshTokenExpiry, "/", domain, secure, true)

	return http.StatusOK, gin.H{
		"user":     user,
		"is_new":   isNewLink,
		"provider": providerName,
	}
}

// LinkProvider links an OIDC provider to the current user (requires authentication)
// This endpoint is used when a logged-in user wants to link a new OIDC provider
// @Summary Get auth URL to link OIDC provider
// @Method POST
// @Router /auth/oidc/:provider/link [post]
// @Security Authorization
// @Param provider path string true "Provider name"
// @Success 200 {object} Success(AuthURLResponse)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) LinkProvider(c *gin.Context) (int, any) {
	providerName := strings.ToLower(c.Param("provider"))
	if providerName == "" {
		return http.StatusBadRequest, errors.New("provider name is required")
	}

	userID, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, errors.New("user not authenticated")
	}

	redirectURI := c.Query("redirect_uri")
	if redirectURI == "" {
		return http.StatusBadRequest, errors.New("redirect_uri is required")
	}

	// Pass userID to indicate this is a link flow
	authURL, state, err := ctr.app.Services.OIDC.GenerateAuthURL(providerName, redirectURI, &userID)
	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, gin.H{
		"auth_url":     authURL,
		"state":        state,
		"redirect_uri": redirectURI,
	}
}

// UnlinkProvider unlinks an OIDC provider from the current user
// @Summary Unlink OIDC provider
// @Method DELETE
// @Router /auth/oidc/:provider/unlink [delete]
// @Security Authorization
// @Param provider path string true "Provider name"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UnlinkProvider(c *gin.Context) (int, any) {
	providerName := strings.ToLower(c.Param("provider"))
	if providerName == "" {
		return http.StatusBadRequest, errors.New("provider name is required")
	}

	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, errors.New("user not authenticated")
	}

	if err := ctr.app.Services.OIDC.UnlinkProvider(userId, providerName); err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, "Provider unlinked successfully"
}

// GetUserProviders returns the OIDC providers linked to the current user
// @Summary Get user's linked OIDC providers
// @Method GET
// @Router /auth/oidc/linked [get]
// @Security Authorization
// @Success 200 {object} Success([]models.UserOIDCProvider)
// @Failure 401 {object} Error
func (ctr *Controller) GetUserProviders(c *gin.Context) (int, any) {
	userId, err := utils.GetUserIdCtx(c)
	if err != nil {
		return http.StatusUnauthorized, errors.New("user not authenticated")
	}

	providers, err := ctr.app.Services.OIDC.GetUserProviders(userId)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to get linked providers")
	}

	return http.StatusOK, providers
}
