package utils

func StringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
