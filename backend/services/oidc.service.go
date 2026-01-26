package services

import (
	"alexandrie/models"
	"alexandrie/oidc"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// StateData contains information about an OIDC flow state
type StateData struct {
	Expiry time.Time
	IsLink bool            // true if this is a link flow, false if login flow
	UserID types.Snowflake // user ID to link to (only set if IsLink is true)
}

type OIDCService interface {
	GetProviders() []oidc.PublicProvider
	IsEnabled() bool
	GenerateAuthURL(providerName, redirectURI string, linkUserID *types.Snowflake) (string, string, error)
	ExchangeCodeForUser(providerName, code, redirectURI string) (*oidc.UserInfo, error)
	LoginOrCreate(providerName string, userInfo *oidc.UserInfo, ip, userAgent string) (*models.User, *models.Session, bool, error)
	LinkProvider(userID types.Snowflake, providerName, providerUserID string) error
	UnlinkProvider(userID types.Snowflake, providerName string) error
	GetUserProviders(userID types.Snowflake) ([]*models.UserOIDCProvider, error)
	ValidateState(state string) (*StateData, error)
}

type oidcService struct {
	oidcRepo    repositories.OIDCProviderRepository
	userRepo    repositories.UserRepository
	userService UserService
	sessionRepo repositories.SessionRepository
	logRepo     repositories.LogRepository
	snowflake   *snowflake.Snowflake
	manager     *oidc.Manager
	client      *http.Client
	states      map[string]*StateData
	statesMu    sync.RWMutex
}

// NewOIDCService creates a new OIDC service
func NewOIDCService(
	oidcRepo repositories.OIDCProviderRepository,
	userRepo repositories.UserRepository,
	userService UserService,
	sessionRepo repositories.SessionRepository,
	logRepo repositories.LogRepository,
	snowflake *snowflake.Snowflake,
) OIDCService {
	svc := &oidcService{
		oidcRepo:    oidcRepo,
		userRepo:    userRepo,
		userService: userService,
		sessionRepo: sessionRepo,
		logRepo:     logRepo,
		snowflake:   snowflake,
		manager:     oidc.GetManager(),
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		states: make(map[string]*StateData),
	}

	// Start cleanup goroutine for expired states
	go svc.cleanupExpiredStates()

	return svc
}

// cleanupExpiredStates periodically removes expired state tokens
func (s *oidcService) cleanupExpiredStates() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		s.statesMu.Lock()
		now := time.Now()
		for state, data := range s.states {
			if now.After(data.Expiry) {
				delete(s.states, state)
			}
		}
		s.statesMu.Unlock()
	}
}

// GetProviders returns all available OIDC providers
func (s *oidcService) GetProviders() []oidc.PublicProvider {
	return s.manager.GetProviders()
}

// IsEnabled returns true if OIDC is enabled
func (s *oidcService) IsEnabled() bool {
	return s.manager.HasProviders()
}

// GenerateAuthURL generates an authorization URL for a provider.
// If linkUserID is provided, this is a link flow (linking provider to existing user).
// If linkUserID is nil, this is a login flow.
func (s *oidcService) GenerateAuthURL(providerName, redirectURI string, linkUserID *types.Snowflake) (string, string, error) {
	provider, err := s.manager.GetProvider(providerName)
	if err != nil {
		return "", "", err
	}

	// Generate a secure random state
	stateBytes := make([]byte, 32)
	if _, err := rand.Read(stateBytes); err != nil {
		return "", "", fmt.Errorf("failed to generate state: %w", err)
	}
	state := base64.URLEncoding.EncodeToString(stateBytes)

	// Store state with metadata
	stateData := &StateData{
		Expiry: time.Now().Add(10 * time.Minute),
		IsLink: linkUserID != nil,
	}
	if linkUserID != nil {
		stateData.UserID = *linkUserID
	}

	s.statesMu.Lock()
	s.states[state] = stateData
	s.statesMu.Unlock()

	// Build authorization URL
	authURL, err := url.Parse(provider.AuthorizationEndpoint)
	if err != nil {
		return "", "", fmt.Errorf("invalid authorization endpoint: %w", err)
	}

	params := url.Values{}
	params.Set("client_id", provider.ClientID)
	params.Set("response_type", "code")
	params.Set("scope", strings.Join(provider.Scopes, " "))
	params.Set("redirect_uri", redirectURI)
	params.Set("state", state)
	authURL.RawQuery = params.Encode()

	return authURL.String(), state, nil
}

// ValidateState validates and consumes an OIDC state token.
// Returns the state data if valid, or an error if invalid/expired.
func (s *oidcService) ValidateState(state string) (*StateData, error) {
	s.statesMu.Lock()
	defer s.statesMu.Unlock()

	data, exists := s.states[state]
	if !exists {
		return nil, errors.New("invalid state")
	}

	// Remove state (one-time use)
	delete(s.states, state)

	// Check if expired
	if time.Now().After(data.Expiry) {
		return nil, errors.New("state expired")
	}

	return data, nil
}

// ExchangeCodeForUser exchanges an authorization code for user info
func (s *oidcService) ExchangeCodeForUser(providerName, code, redirectURI string) (*oidc.UserInfo, error) {
	provider, err := s.manager.GetProvider(providerName)
	if err != nil {
		return nil, err
	}

	// Exchange code for tokens
	tokenResp, err := s.exchangeCode(provider, code, redirectURI)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}

	// Get user info
	userInfo, err := s.getUserInfo(provider, tokenResp.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	return userInfo, nil
}

// exchangeCode exchanges an authorization code for tokens
func (s *oidcService) exchangeCode(provider *oidc.Provider, code, redirectURI string) (*oidc.TokenResponse, error) {
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)
	data.Set("client_id", provider.ClientID)
	data.Set("client_secret", provider.ClientSecret)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, provider.TokenEndpoint, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("token endpoint returned status %d: %s", resp.StatusCode, string(body))
	}

	var tokenResp oidc.TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, fmt.Errorf("failed to decode token response: %w", err)
	}

	return &tokenResp, nil
}

// getUserInfo fetches user info from the OIDC provider
func (s *oidcService) getUserInfo(provider *oidc.Provider, accessToken string) (*oidc.UserInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, provider.UserinfoEndpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("userinfo endpoint returned status %d: %s", resp.StatusCode, string(body))
	}

	var userInfo oidc.UserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, fmt.Errorf("failed to decode user info: %w", err)
	}

	return &userInfo, nil
}

// LoginOrCreate attempts to login via OIDC or creates a new user
// Returns: user, session, isNewLink (true if this is a new provider link), error
func (s *oidcService) LoginOrCreate(providerName string, userInfo *oidc.UserInfo, ip, userAgent string) (*models.User, *models.Session, bool, error) {

	providerName = strings.ToLower(providerName)

	// Check if this OIDC identity is already linked to a user
	link, err := s.oidcRepo.GetByProviderAndSubject(providerName, userInfo.Sub)
	if err != nil {
		return nil, nil, false, fmt.Errorf("failed to check OIDC link: %w", err)
	}
	if link != nil {
		// User already linked, perform login
		user, err := s.userRepo.GetByID(link.UserId)
		if err != nil || user == nil {
			return nil, nil, false, errors.New("linked user not found")
		}

		// Create session
		session, err := s.createSession(user, ip, userAgent)
		if err != nil {
			return nil, nil, false, err
		}

		return user, session, false, nil
	}

	// No link exists - create new user

	user, err := s.createUserFromOIDC(userInfo)
	if err != nil {
		return nil, nil, false, fmt.Errorf("failed to create user: %w", err)
	}

	// Link the OIDC provider to the user
	if err := s.LinkProvider(user.Id, providerName, userInfo.Sub); err != nil {
		return nil, nil, false, fmt.Errorf("failed to link provider: %w", err)
	}

	// Create session
	session, err := s.createSession(user, ip, userAgent)
	if err != nil {
		return nil, nil, false, err
	}

	return user, session, true, nil
}

// createSession creates a new session for a user
func (s *oidcService) createSession(user *models.User, ip, userAgent string) (*models.Session, error) {
	session := &models.Session{
		Id:                   s.snowflake.Generate(),
		UserId:               user.Id,
		RefreshToken:         signRefreshToken(),
		ExpireToken:          time.Now().Add(30 * 24 * time.Hour).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}

	if _, err := s.sessionRepo.Create(session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	// Log the login asynchronously
	go func() {
		s.logRepo.Create(&models.Log{
			Id:        s.snowflake.Generate(),
			UserId:    user.Id,
			IpAddr:    ip,
			Timestamp: time.Now().UnixMilli(),
			Type:      "login_oidc",
			Location:  s.logRepo.GetLocationFromIP(ip),
			UserAgent: userAgent,
		})
	}()

	return session, nil
}

// createUserFromOIDC creates a new user from OIDC user info
func (s *oidcService) createUserFromOIDC(userInfo *oidc.UserInfo) (*models.User, error) {
	// User object
	userID := s.snowflake.Generate()
	username := s.userService.GenerateUniqueUsername(userInfo.PreferredUsername, userID)
	now := time.Now().UnixMilli()
	user := &models.User{
		Id:               userID,
		Username:         username,
		Email:            userInfo.Email,
		Role:             1, // Default user role
		CreatedTimestamp: now,
		UpdatedTimestamp: now,
	}
	fmt.Println("Generated username:", username)
	// Set optional fields
	if userInfo.GivenName != nil && *userInfo.GivenName != "" {
		user.Firstname = userInfo.GivenName
	}
	fmt.Println("ok")
	if userInfo.FamilyName != nil && *userInfo.FamilyName != "" {
		user.Lastname = userInfo.FamilyName
	}
	if userInfo.Picture != nil && *userInfo.Picture != "" {
		user.Avatar = userInfo.Picture
	}
	fmt.Println("ok2")
	createdUser, err := s.userRepo.Create(user)

	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

// LinkProvider links an OIDC provider to an existing user
func (s *oidcService) LinkProvider(userID types.Snowflake, providerName, providerUserID string) error {
	providerName = strings.ToLower(providerName)

	// Check if already linked
	existing, err := s.oidcRepo.GetByProviderAndSubject(providerName, providerUserID)
	if err != nil {
		return fmt.Errorf("failed to check existing link: %w", err)
	}
	if existing != nil {
		if existing.UserId == userID {
			return nil // Already linked to this user
		}
		return errors.New("this OIDC account is already linked to another user")
	}

	now := time.Now().UnixMilli()
	link := &models.UserOIDCProvider{
		Id:               s.snowflake.Generate(),
		UserId:           userID,
		ProviderName:     providerName,
		ProviderUserId:   providerUserID,
		CreatedTimestamp: now,
		UpdatedTimestamp: now,
	}

	_, err = s.oidcRepo.Create(link)
	return err
}

// UnlinkProvider removes an OIDC provider link from a user
func (s *oidcService) UnlinkProvider(userID types.Snowflake, providerName string) error {
	providerName = strings.ToLower(providerName)

	links, err := s.oidcRepo.GetByUserID(userID)
	if err != nil {
		return fmt.Errorf("failed to get user OIDC links: %w", err)
	}
	// Check if user has another login method available before unlinking
	userPassword, err := s.userRepo.HasPassword(userID)
	if err != nil {
		return errors.New("failed to get user password status")
	}
	if !userPassword && len(links) <= 1 {
		return errors.New("cannot unlink the only login method")
	}

	for _, link := range links {
		if strings.ToLower(link.ProviderName) == providerName {
			return s.oidcRepo.Delete(link.Id)
		}
	}

	return errors.New("provider link not found")
}

// GetUserProviders returns all OIDC providers linked to a user
func (s *oidcService) GetUserProviders(userID types.Snowflake) ([]*models.UserOIDCProvider, error) {
	return s.oidcRepo.GetByUserID(userID)
}
