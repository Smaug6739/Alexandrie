package main

import (
	"Smaug6739/Alexandrie/server"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"golang.org/x/net/publicsuffix"
)

// Démarrer le vrai serveur Gin en arrière-plan
func startTestServer() *httptest.Server {
	router, _ := server.SetupServer()
	return httptest.NewServer(router)
}

func TestFullAuthenticationFlow(t *testing.T) {
	fmt.Println("Starting test...")
	// 1. Lancer le serveur de test
	ts := startTestServer()
	defer ts.Close()

	// 2. Créer un client HTTP avec un cookiejar pour gérer les cookies comme un navigateur
	options := &cookiejar.Options{PublicSuffixList: publicsuffix.List}
	jar, _ := cookiejar.New(options)
	client := &http.Client{Jar: jar}

	t.Run("Login", func(t *testing.T) {
		loginURL := ts.URL + "/api/auth"
		loginData := map[string]string{"username": "Hacker", "password": "10082005"}
		resp, body := PerformRequest(t, client, "POST", loginURL, loginData)
		assert.Equal(t, http.StatusOK, resp.StatusCode)
		assert.Contains(t, body, "\"status\":\"success\"")
	})
	t.Run("Protected", func(t *testing.T) {
		resp, body := PerformRequest(t, client, "GET", ts.URL+"/api/users/@me", nil)
		assert.Equal(t, http.StatusOK, resp.StatusCode)
		assert.Contains(t, body, "\"status\":\"success\"")
	})

}

// CreateTestClient creates an HTTP client with a cookie jar.
func CreateTestClient() *http.Client {
	options := &cookiejar.Options{PublicSuffixList: publicsuffix.List}
	jar, _ := cookiejar.New(options)
	return &http.Client{Jar: jar}
}

// PerformRequest performs an HTTP request and returns the response and body.
func PerformRequest(t *testing.T, client *http.Client, method, url string, body interface{}) (*http.Response, string) {
	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		assert.NoError(t, err)
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, url, reqBody)
	assert.NoError(t, err)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	assert.NoError(t, err)

	respBody, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	defer resp.Body.Close()

	return resp, string(respBody)
}
