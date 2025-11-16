package utils

// Utility functions for domain and environment variable management

import (
	"fmt"
	"net/url"
	"os"
	"strings"
)

// SetDomainEnv initializes DOMAIN_CLIENT and COOKIE_DOMAIN environment variables
// based on FRONTEND_URL (if defined).
// If FRONTEND_URL is not set, the function does nothing.
//
// Example:
// FRONTEND_URL=https://alexandrie-hub.fr
// -> DOMAIN_CLIENT=https://alexandrie-hub.fr
// -> COOKIE_DOMAIN=alexandrie-hub.fr
//
// FRONTEND_URL=http://localhost:8200
// -> DOMAIN_CLIENT=http://localhost:8200
// -> COOKIE_DOMAIN=localhost
func SetDomainEnv() {
	frontendURL := strings.TrimSpace(os.Getenv("FRONTEND_URL"))
	if frontendURL == "" {
		return
	}

	u, err := url.Parse(frontendURL)
	if err != nil || u.Host == "" {
		fmt.Fprintf(os.Stderr, "⚠️  Invalid FRONTEND_URL env variable: %s\n Expected format: http(s)://<host>[:port] \n > Example: https://alexandrie-hub.fr \n > Example: http://localhost:8200\n", frontendURL)
		os.Exit(1)
	}

	// Remove port for cookie domain if present
	host := u.Host
	if idx := strings.Index(host, ":"); idx != -1 {
		host = host[:idx]
	}

	// Set derived environment variables
	_ = os.Setenv("DOMAIN_CLIENT", fmt.Sprintf("%s://%s", u.Scheme, u.Host))
	_ = os.Setenv("COOKIE_DOMAIN", host)
}
