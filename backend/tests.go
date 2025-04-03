package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"golang.org/x/net/publicsuffix"
)

// Démarrer le vrai serveur Gin en arrière-plan
func startTestServer() *httptest.Server {
	router, _ := SetupServer()
	return httptest.NewServer(router)
}

func TestFullAuthenticationFlow(t *testing.T) {
	// 1. Lancer le serveur de test
	ts := startTestServer()
	defer ts.Close()

	// 2. Créer un client HTTP avec un cookiejar pour gérer les cookies comme un navigateur
	options := &cookiejar.Options{PublicSuffixList: publicsuffix.List}
	jar, _ := cookiejar.New(options)
	client := &http.Client{Jar: jar}

	// 3. Simuler un utilisateur qui s'inscrit (si besoin)
	loginURL := ts.URL + "/login" // Remplace par ton vrai endpoint
	signupData, _ := json.Marshal(map[string]string{"username": "Hacker", "password": "10082005"})
	loginReq, _ := http.NewRequest("POST", loginURL, bytes.NewBuffer(signupData))
	loginReq.Header.Set("Content-Type", "application/json")

	loginResp, _ := client.Do(loginReq)
	assert.Equal(t, http.StatusOK, loginResp.StatusCode)

	// 6. Attendre un peu (optionnel, si test d'expiration)
	time.Sleep(1 * time.Second)

	// 7. Accéder à une route protégée en utilisant le cookie JWT
	protectedURL := ts.URL + "/users/@me"
	protectedReq, _ := http.NewRequest("GET", protectedURL, nil)

	protectedResp, _ := client.Do(protectedReq)
	body, _ := io.ReadAll(protectedResp.Body)
	defer protectedResp.Body.Close()
	fmt.Println(string(body))

	// 8. Vérifier que l’accès est autorisé
	assert.Equal(t, http.StatusOK, protectedResp.StatusCode)
}
