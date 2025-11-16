package tests

import (
	"fmt"
	"net/http"
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"
)

func LoginAs(t *testing.T, client *http.Client, username, password string) APIResponse {
	return DoPost(t, client, "/auth", fmt.Sprintf("username=%s&password=%s", username, password))
}

func TestLogin(t *testing.T) {
	client := InitClient(t)
	t.Run("Correct credentials", func(t *testing.T) {
		r := LoginAs(t, client, "Smaug", "41258")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)

		// Check if token is present in cookies
		url, err := url.Parse(BaseURL)
		if err != nil {
			t.Fatalf("Failed to parse base URL: %v", err)
		}
		cookies := client.Jar.Cookies(url)
		assert.Len(t, cookies, 2)
		assert.Equal(t, "Authorization", cookies[0].Name)
		assert.Equal(t, "RefreshToken", cookies[1].Name)

	})
	t.Run("Incorrect credentials", func(t *testing.T) {
		client := InitClient(t)
		r := LoginAs(t, client, "Smaug", "wrongpassword")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 401, r.StatusCode)
		assert.Equal(t, "Invalid credentials", r.Message)
	})
	t.Run("Missing username", func(t *testing.T) {
		client := InitClient(t)
		r := LoginAs(t, client, "", "password")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 400, r.StatusCode)
		assert.Equal(t, "Username is required.", r.Message)
	})
	t.Run("Missing password", func(t *testing.T) {
		client := InitClient(t)
		r := LoginAs(t, client, "username", "")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 400, r.StatusCode)
		assert.Equal(t, "Password is required.", r.Message)
	})
	t.Run("Missing credentials", func(t *testing.T) {
		client := InitClient(t)
		r := LoginAs(t, client, "", "")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 400, r.StatusCode)
		assert.Equal(t, "Username is required. Password is required.", r.Message)
	})

}
