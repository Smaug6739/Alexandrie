package utils_test

import (
	"alexandrie/utils"
	"testing"
)

func TestCheckPermission(t *testing.T) {
	tests := []struct {
		userRole     int
		requiredRole int
		expected     bool
	}{
		{utils.ADMINISTRATOR, utils.ADMINISTRATOR, true},
		{utils.ADMINISTRATOR | utils.MANAGER, utils.MANAGER, true},
		{utils.MANAGER, utils.ADMINISTRATOR, false},
		{0, utils.ADMINISTRATOR, false},
		{1, utils.ADMINISTRATOR, false},
		{1, utils.MANAGER, false},
		{1, utils.MODERATOR, false},
		{2, utils.ADMINISTRATOR, true},
		{2, utils.MANAGER, false},
		{2, utils.MODERATOR, false},
	}

	for _, test := range tests {
		result := utils.CheckPermission(test.userRole, test.requiredRole)
		if result != test.expected {
			t.Errorf("CheckPermission(%d, %d) = %v; expected %v", test.userRole, test.requiredRole, result, test.expected)
		}
	}
}
func TestCheckPermissionWithMultipleRoles(t *testing.T) {
	tests := []struct {
		userRole     int
		requiredRole int
		expected     bool
	}{
		{utils.ADMINISTRATOR | utils.MANAGER, utils.MANAGER, true},
		{utils.MANAGER | utils.MODERATOR, utils.MODERATOR, true},
		{utils.MODERATOR, utils.MANAGER, false},
	}

	for _, test := range tests {
		result := utils.CheckPermission(test.userRole, test.requiredRole)
		if result != test.expected {
			t.Errorf("CheckPermission(%d, %d) = %v; expected %v", test.userRole, test.requiredRole, result, test.expected)
		}
	}
}
