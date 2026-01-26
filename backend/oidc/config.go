package oidc

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"slices"
	"strings"
	"sync"
	"time"

	"alexandrie/pkg/logger"
)

// Provider represents an OIDC provider configuration
type Provider struct {
	Name         string `json:"name"`
	ConfigURL    string `json:"config_url"`
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	// Discovered from .well-known/openid-configuration
	AuthorizationEndpoint string   `json:"authorization_endpoint,omitempty"`
	TokenEndpoint         string   `json:"token_endpoint,omitempty"`
	UserinfoEndpoint      string   `json:"userinfo_endpoint,omitempty"`
	JwksURI               string   `json:"jwks_uri,omitempty"`
	Issuer                string   `json:"issuer,omitempty"`
	Scopes                []string `json:"scopes,omitempty"` // Minimal: openid - optional: profile, email
}

// PublicProvider is the public-facing provider info (without secrets)
type PublicProvider struct {
	Name                  string `json:"name"`
	AuthorizationEndpoint string `json:"authorization_endpoint"`
}

// OIDCDiscovery represents the OpenID Connect discovery document
type OIDCDiscovery struct {
	Issuer                string   `json:"issuer"`
	AuthorizationEndpoint string   `json:"authorization_endpoint"`
	TokenEndpoint         string   `json:"token_endpoint"`
	UserinfoEndpoint      string   `json:"userinfo_endpoint"`
	JwksURI               string   `json:"jwks_uri"`
	ScopesSupported       []string `json:"scopes_supported"`
}

// TokenResponse represents the OIDC token response
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token,omitempty"`
	IDToken      string `json:"id_token,omitempty"`
	Scope        string `json:"scope,omitempty"`
}

// UserInfo represents the OIDC userinfo response
type UserInfo struct {
	Sub               string  `json:"sub"`
	Email             *string `json:"email"`
	EmailVerified     *bool   `json:"email_verified"`
	PreferredUsername *string `json:"preferred_username"`
	Name              *string `json:"name"`
	GivenName         *string `json:"given_name"`
	FamilyName        *string `json:"family_name"`
	Picture           *string `json:"picture"`
}

// Manager manages multiple OIDC providers
type Manager struct {
	providers map[string]*Provider
	mu        sync.RWMutex
	client    *http.Client
}

var (
	globalManager *Manager
	once          sync.Once
)

// GetManager returns the global OIDC manager instance
func GetManager() *Manager {
	once.Do(func() {
		globalManager = &Manager{
			providers: make(map[string]*Provider),
			client: &http.Client{
				Timeout: 10 * time.Second,
			},
		}
		globalManager.loadFromEnv()
	})
	return globalManager
}

// loadFromEnv loads OIDC providers from environment variables
// Supports multiple providers via indexed env vars:
//
//	OIDC_1_CONFIG_URL, OIDC_1_CLIENT_ID, OIDC_1_CLIENT_SECRET, OIDC_1_PROVIDER_NAME
//	OIDC_2_CONFIG_URL, OIDC_2_CLIENT_ID, OIDC_2_CLIENT_SECRET, OIDC_2_PROVIDER_NAME
func (m *Manager) loadFromEnv() {

	// Try indexed providers (OIDC_1_*, OIDC_2_*, etc.)
	for i := 1; i <= 10; i++ {
		prefix := fmt.Sprintf("OIDC_%d_", i)
		configURL := os.Getenv(prefix + "CONFIG_URL")
		if configURL == "" {
			continue
		}

		provider := &Provider{
			Name:         os.Getenv(prefix + "PROVIDER_NAME"),
			ConfigURL:    configURL,
			ClientID:     os.Getenv(prefix + "CLIENT_ID"),
			ClientSecret: os.Getenv(prefix + "CLIENT_SECRET"),
		}
		if provider.Name == "" {
			provider.Name = fmt.Sprintf("provider_%d", i)
		}
		if err := m.AddProvider(provider); err != nil {
			logger.Error(fmt.Sprintf("Failed to add OIDC provider '%s': %v", provider.Name, err))
		}
	}

	count := len(m.providers)
	if count > 0 {
		logger.Success(fmt.Sprintf("OIDC: Loaded %d provider(s)", count))
	} else {
		logger.Info("OIDC: No providers configured")
	}
}

// AddProvider adds a new OIDC provider and discovers its endpoints
func (m *Manager) AddProvider(provider *Provider) error {
	if provider.ConfigURL == "" {
		return fmt.Errorf("provider config URL is required")
	}
	if provider.ClientID == "" {
		return fmt.Errorf("provider client ID is required")
	}
	if provider.ClientSecret == "" {
		return fmt.Errorf("provider client secret is required")
	}

	// Normalize provider name to lowercase
	providerName := strings.ToLower(provider.Name)

	// Discover OIDC endpoints
	discovery, err := m.discoverEndpoints(provider.ConfigURL)
	if err != nil {
		return fmt.Errorf("failed to discover OIDC endpoints: %w", err)
	}

	provider.AuthorizationEndpoint = discovery.AuthorizationEndpoint
	provider.TokenEndpoint = discovery.TokenEndpoint
	provider.UserinfoEndpoint = discovery.UserinfoEndpoint
	provider.JwksURI = discovery.JwksURI
	provider.Issuer = discovery.Issuer

	// Scopes: ensure "openid" is included and add common optional scopes
	provider.Scopes = []string{"openid"}
	if slices.Contains(discovery.ScopesSupported, "profile") {
		provider.Scopes = append(provider.Scopes, "profile")
	}
	if slices.Contains(discovery.ScopesSupported, "email") {
		provider.Scopes = append(provider.Scopes, "email")
	}

	m.mu.Lock()
	m.providers[providerName] = provider
	m.mu.Unlock()

	logger.Info(fmt.Sprintf("OIDC: Added provider '%s' (issuer: %s)", providerName, provider.Issuer))
	return nil
}

// discoverEndpoints fetches the OIDC discovery document
func (m *Manager) discoverEndpoints(configURL string) (*OIDCDiscovery, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, configURL, nil)
	if err != nil {
		return nil, err
	}

	resp, err := m.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("discovery endpoint returned status %d", resp.StatusCode)
	}

	var discovery OIDCDiscovery
	if err := json.NewDecoder(resp.Body).Decode(&discovery); err != nil {
		return nil, fmt.Errorf("failed to decode discovery document: %w", err)
	}

	return &discovery, nil
}

// GetProvider returns a provider by name
func (m *Manager) GetProvider(name string) (*Provider, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	provider, exists := m.providers[strings.ToLower(name)]
	if !exists {
		return nil, fmt.Errorf("OIDC provider '%s' not found", name)
	}
	return provider, nil
}

// GetProviders returns all configured providers (public info only)
func (m *Manager) GetProviders() []PublicProvider {
	m.mu.RLock()
	defer m.mu.RUnlock()

	providers := make([]PublicProvider, 0, len(m.providers))
	for _, p := range m.providers {
		providers = append(providers, PublicProvider{
			Name:                  p.Name,
			AuthorizationEndpoint: p.AuthorizationEndpoint,
		})
	}
	return providers
}

// HasProviders returns true if at least one OIDC provider is configured
func (m *Manager) HasProviders() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.providers) > 0
}

// IsEnabled returns true if OIDC is enabled (at least one provider configured)
func IsEnabled() bool {
	return GetManager().HasProviders()
}
