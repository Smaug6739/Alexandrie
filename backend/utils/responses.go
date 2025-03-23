package utils

import (
	"time"

	"github.com/gin-gonic/gin"
)

func Success(data any) gin.H {
	return gin.H{
		"status":    "success",
		"result":    data,
		"timestamp": time.Now().UnixMilli(),
	}
}

func Error(message string) gin.H {
	return gin.H{
		"status":    "error",
		"message":   message,
		"timestamp": time.Now().UnixMilli(),
	}
}
