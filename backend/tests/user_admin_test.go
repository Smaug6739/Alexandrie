package tests

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUserAdmin(t *testing.T) {
	client := InitClient(t)

	// ************************************************************
	// POST /users/
	// ************************************************************
	t.Run("Login admin", func(t *testing.T) {
		r := LoginAs(t, client, ADMIN_USERNAME, ADMIN_PASSWORD)
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], ADMIN_USERNAME)
		assert.Equal(t, r.Result.(map[string]any)["role"], json.Number("2"))
	})
	var old_lastname, old_firstname, old_email string
	t.Run("Get @me admin", func(t *testing.T) {
		r := DoGet(t, client, "/users/@me")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], ADMIN_USERNAME)
		assert.Equal(t, r.Result.(map[string]any)["role"], json.Number("2"))
		old_lastname = r.Result.(map[string]any)["lastname"].(string)
		old_firstname = r.Result.(map[string]any)["firstname"].(string)
		old_email = r.Result.(map[string]any)["email"].(string)
	})
	t.Run("Update @me account", func(t *testing.T) {
		r := DoPatch(t, client, "/users/@me", map[string]any{
			"username":  "Balthazar",
			"firstname": "Thomas",
			"email":     "thomas.v@gmail.com",
			"role":      1,
		})
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
	})
	t.Run("Get @me admin", func(t *testing.T) {
		r := DoGet(t, client, "/users/@me")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], ADMIN_USERNAME) // Should be the old username
		assert.Equal(t, r.Result.(map[string]any)["role"], json.Number("2"))   // Should be the old role
		assert.Equal(t, r.Result.(map[string]any)["firstname"], "Thomas")
		assert.Equal(t, r.Result.(map[string]any)["lastname"], old_lastname)
		assert.Equal(t, r.Result.(map[string]any)["email"], "thomas.v@gmail.com")
	})
	t.Run("Reset @me account", func(t *testing.T) {
		r := DoPatch(t, client, "/users/@me", map[string]any{
			"firstname": old_firstname,
			"lastname":  old_lastname,
			"email":     old_email,
			"username":  ADMIN_USERNAME,
		})
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
	})
	// Update other user
	var old_user_firstname, old_user_lastname, old_user_email string
	t.Run("Get /:ID", func(t *testing.T) {
		r := DoGet(t, client, "/users/"+USER_ID)
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		old_user_firstname = r.Result.(map[string]any)["firstname"].(string)
		old_user_lastname = r.Result.(map[string]any)["lastname"].(string)
		old_user_email = r.Result.(map[string]any)["email"].(string)
		assert.Equal(t, r.Result.(map[string]any)["username"], USER_USERNAME)
		assert.Equal(t, r.Result.(map[string]any)["password"], nil)
	})
	t.Run("Update /:ID", func(t *testing.T) {
		r := DoPatch(t, client, "/users/"+USER_ID, map[string]any{
			"firstname": "Thomas",
			"lastname":  "V",
			"role":      1,
			"username":  USER_USERNAME,
			"email":     old_user_email,
		})
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
	})
	t.Run("Get /:ID", func(t *testing.T) {
		r := DoGet(t, client, "/users/"+USER_ID)
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], USER_USERNAME)
		assert.Equal(t, r.Result.(map[string]any)["firstname"], "Thomas")
		assert.Equal(t, r.Result.(map[string]any)["lastname"], "V")
	})
	t.Run("Reset /:ID", func(t *testing.T) {
		r := DoPatch(t, client, "/users/"+USER_ID, map[string]any{
			"firstname": old_user_firstname,
			"lastname":  old_user_lastname,
			"role":      0,
			"username":  USER_USERNAME,
			"email":     old_user_email,
		})
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
	})
}
