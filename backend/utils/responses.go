package utils

import (
	"time"

	"github.com/gin-gonic/gin"
)

func Success(data any) gin.H {
	return gin.H{
		"status":    "success",
		"timestamp": time.Now().UnixMilli(),
		"result":    data,
	}
}

func Error(message string) gin.H {
	return gin.H{
		"status":    "error",
		"timestamp": time.Now().UnixMilli(),
		"message":   message,
	}
}
