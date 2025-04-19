package tests

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

var partial_user = map[string]any{
	"firstname": "George",
	"lastname":  "Nolan",
	"email":     "gnolan@gmail.com",
}

func TestUserLifeCycle(t *testing.T) {
	client := InitClient(t)

	// ************************************************************
	// POST /users/
	// ************************************************************
	t.Run("User creation missing password", func(t *testing.T) {
		partial_user["username"] = "gnolan"
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "error", response.Status)
		assert.Equal(t, 400, response.StatusCode)
		assert.Equal(t, "Password is required", response.Message)
	})
	t.Run("User creation missing username", func(t *testing.T) {
		partial_user["password"] = "password"
		partial_user["username"] = nil
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "error", response.Status)
		assert.Equal(t, 400, response.StatusCode)
		assert.Equal(t, "Username is required.", response.Message)
	})
	t.Run("User creation missing email", func(t *testing.T) {
		partial_user["username"] = "gnolan"
		partial_user["password"] = "password"
		partial_user["email"] = ""
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "error", response.Status)
		assert.Equal(t, 400, response.StatusCode)
		assert.Equal(t, "Email is required.", response.Message)
	})
	t.Run("User creation invalid email", func(t *testing.T) {
		partial_user["username"] = "gnolan"
		partial_user["password"] = "password"
		partial_user["email"] = "invalid_email"
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "error", response.Status)
		assert.Equal(t, 400, response.StatusCode)
		assert.Equal(t, "Email must be valid", response.Message)
	})
	t.Run("User creation username already exists", func(t *testing.T) {
		partial_user["username"] = ADMIN_USERNAME
		partial_user["email"] = "gnolan@gmail.com"
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "error", response.Status)
		assert.Equal(t, 400, response.StatusCode)
		assert.Equal(t, "Username already exists", response.Message)
	})

	t.Run("User creation success", func(t *testing.T) {
		partial_user["username"] = "gnolan"
		response := DoPost(t, client, "/users/", partial_user)
		assert.Equal(t, "success", response.Status)
		assert.Equal(t, 201, response.StatusCode)
	})

	t.Run("Login as user gnolan", func(t *testing.T) {
		r := LoginAs(t, client, "gnolan", "password")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], "gnolan")
	})

	// ************************************************************
	// GET /users/XX
	// ************************************************************
	var userId int64
	t.Run("Get @me gnolan", func(t *testing.T) {
		r := DoGet(t, client, "/users/@me")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		idNum, ok := r.Result.(map[string]any)["id"].(json.Number)
		if !ok {
			t.Fatal("ID is not a json.Number")
		}
		u, err := idNum.Int64()
		if err != nil {
			t.Fatal("Error converting ID to int64:", err)
		}
		userId = u
		assert.Equal(t, r.Result.(map[string]any)["username"], "gnolan")
	})
	t.Run("Get user by ID", func(t *testing.T) {
		r := DoGet(t, client, "/users/"+fmt.Sprintf("%d", userId))
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
		assert.Equal(t, IsValidUser(t, r), true)
		assert.Equal(t, r.Result.(map[string]any)["username"], "gnolan")
	})
	t.Run("Get user by ID with invalid ID", func(t *testing.T) {
		r := DoGet(t, client, "/users/invalid_id")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 400, r.StatusCode)
		assert.Equal(t, "Invalid parameter", r.Message)
	})
	t.Run("Get user by ID with non-existing ID", func(t *testing.T) {
		r := DoGet(t, client, "/users/999999999999999999")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 400, r.StatusCode)
		assert.Equal(t, "Unauthorized", r.Message)
	})
	// ************************************************************
	// GET /users/
	// ************************************************************
	t.Run("Get all users", func(t *testing.T) {
		r := DoGet(t, client, "/users/")
		assert.Equal(t, "error", r.Status)
		assert.Equal(t, 401, r.StatusCode)
		assert.Equal(t, "Unauthorized", r.Message)
	})
	// ************************************************************
	// DELETE /users/@me
	// ************************************************************
	t.Run("Delete user", func(t *testing.T) {
		r := DoDelete(t, client, "/users/@me")
		assert.Equal(t, "success", r.Status)
		assert.Equal(t, 200, r.StatusCode)
	})
	// Check if the user is deleted
}

func validateUser(user map[string]any) bool {
	// Check if the user map contains all required fields
	requiredFields := []string{"id", "username", "firstname", "lastname", "role", "avatar", "email", "created_timestamp", "updated_timestamp"}
	for _, field := range requiredFields {
		if _, ok := user[field]; !ok {
			return false
		}
	}
	return true
}

func IsValidUser(t *testing.T, r APIResponse) bool {
	// Check if the data is of type map[string]any
	assert.IsType(t, map[string]any{}, r.Result)
	data, ok := r.Result.(map[string]any)
	if !ok {
		t.Fatalf("The 'result' field is not of type JSON (map[string]any)")
		return false
	}
	// Check if the data is a valid user
	return validateUser(data)
}
