package router

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func TestCredentialedCORSOnlyTrustsFrontend(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name        string
		frontendURL string
		origin      string
		allowed     bool
	}{
		{"frontend", "https://alexandrie-hub.fr", "https://alexandrie-hub.fr", true},
		{"frontend with config trailing slash", "https://alexandrie-hub.fr/", "https://alexandrie-hub.fr", true},
		{"public CDN", "https://alexandrie-hub.fr", "https://cdn.alexandrie-hub.fr", false},
		{"API subdomain", "https://alexandrie-hub.fr", "https://api.alexandrie-hub.fr", false},
		{"lookalike hostname", "https://alexandrie-hub.fr", "https://alexandrie-hub.fr.evil.test", false},
		{"different scheme", "https://alexandrie-hub.fr", "http://alexandrie-hub.fr", false},
		{"opaque origin", "https://alexandrie-hub.fr", "null", false},
		{"multiple origins", "https://alexandrie-hub.fr", "https://alexandrie-hub.fr https://cdn.alexandrie-hub.fr", false},
		{"local frontend port", "http://localhost:8200", "http://localhost:8200", true},
		{"same host different port", "http://localhost:8200", "http://localhost:8201", false},
		{"missing frontend configuration", "", "https://cdn.alexandrie-hub.fr", false},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			r := gin.New()
			r.Use(cors.New(frontendCORSConfig(tc.frontendURL)))
			handlerCalls := 0
			handler := func(c *gin.Context) {
				handlerCalls++
				c.String(http.StatusOK, "private")
			}
			r.GET("/api/private", handler)
			r.POST("/api/private", handler)

			for _, method := range []string{http.MethodGet, http.MethodPost, http.MethodOptions} {
				req := httptest.NewRequest(method, "/api/private", nil)
				req.Header.Set("Origin", tc.origin)
				if method == http.MethodOptions {
					req.Header.Set("Access-Control-Request-Method", http.MethodPost)
					req.Header.Set("Access-Control-Request-Headers", "content-type,authorization")
				} else if method == http.MethodPost {
					req.Header.Set("Content-Type", "application/json")
				}
				resp := httptest.NewRecorder()
				r.ServeHTTP(resp, req)

				gotOrigin := resp.Header().Get("Access-Control-Allow-Origin")
				gotCredentials := resp.Header().Get("Access-Control-Allow-Credentials")
				if tc.allowed {
					if gotOrigin != tc.origin || gotCredentials != "true" {
						t.Fatalf("%s allowed origin: CORS origin=%q credentials=%q", method, gotOrigin, gotCredentials)
					}
					if resp.Code >= 400 {
						t.Fatalf("%s allowed origin: unexpected status %d", method, resp.Code)
					}
					if method == http.MethodOptions {
						headers := strings.ToLower(resp.Header().Get("Access-Control-Allow-Headers"))
						if !strings.Contains(headers, "content-type") || !strings.Contains(headers, "authorization") {
							t.Fatalf("preflight missing frontend request headers: %q", headers)
						}
						if !strings.Contains(resp.Header().Get("Access-Control-Allow-Methods"), http.MethodPost) {
							t.Fatalf("preflight missing POST method: %q", resp.Header().Get("Access-Control-Allow-Methods"))
						}
					}
				} else if gotOrigin != "" || resp.Code != http.StatusForbidden {
					t.Fatalf("%s disallowed origin: status=%d CORS origin=%q", method, resp.Code, gotOrigin)
				}
			}
			if !tc.allowed && handlerCalls != 0 {
				t.Fatalf("disallowed origin reached API handler %d times", handlerCalls)
			}
		})
	}
}

func TestSameOriginRequestWithoutOriginHeader(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(cors.New(frontendCORSConfig("https://alexandrie-hub.fr")))
	r.GET("/api/private", func(c *gin.Context) { c.String(http.StatusOK, "private") })

	resp := httptest.NewRecorder()
	r.ServeHTTP(resp, httptest.NewRequest(http.MethodGet, "/api/private", nil))
	if resp.Code != http.StatusOK || resp.Body.String() != "private" {
		t.Fatalf("same-origin request failed: status=%d body=%q", resp.Code, resp.Body.String())
	}
}
