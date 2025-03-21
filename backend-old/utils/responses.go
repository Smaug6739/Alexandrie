package utils

import (
	"time"
)


type internal_success struct {
	status string
	result any
	timestamp int64
}
type internal_error struct {
	status string
	message string
	timestamp int64
}



func Success(data any) internal_success {
	return internal_success{
		status: "success",
		result: data,
		timestamp: time.Now().UnixMilli(),
	}
}

func Error(message string) internal_error {
	return internal_error{
		status: "error",
		message: message,
		timestamp: time.Now().UnixMilli(),
	}
}