package utils

func IfNotNilPointer[T any](newValue, defaultValue *T) *T {
	if newValue != nil {
		return newValue
	}
	return defaultValue
}
func IfNotNilValue[T any](newValue *T, defaultValue T) T {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}
