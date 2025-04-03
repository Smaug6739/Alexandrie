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

func HandleResponse(c *gin.Context, code int, body any) bool {
	// If it's an error, we need to set the status code and return the error message
	// body is of type error if it's an error, otherwise it's an interface{}
	if err, ok := body.(error); ok {
		c.JSON(code, Error(err.Error()))
	} else {
		c.JSON(code, Success(body))
	}
	return true
}
