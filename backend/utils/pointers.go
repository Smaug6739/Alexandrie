package utils

// Utility functions for pointer handling

func StringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
