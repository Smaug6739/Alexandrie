package utils

import (
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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

func WP(f func(c *gin.Context) (int, any)) gin.HandlerFunc {
	return func(c *gin.Context) {
		code, body := f(c)
		if err, ok := body.(validator.ValidationErrors); ok {
			var errors []string
			for _, e := range err {
				errors = append(errors, validationErrorToText(e))
			}
			c.JSON(code, Error(strings.Join(errors, " ")))
		} else if err, ok := body.(error); ok {
			c.JSON(code, Error(err.Error()))
		} else {
			c.JSON(code, Success(body))
		}
	}
}

func validationErrorToText(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return e.Field() + " is required."
	case "email":
		return e.Field() + " must be a valid"
	case "min":
		return e.Field() + " must be at least " + e.Param() + " characters long."
	case "max":
		return e.Field() + " must be at most " + e.Param() + " characters long."
	case "oneof":
		return e.Field() + " must be one of the following values: " + e.Param() + "."
	case "url":
		return e.Field() + " must be a valid URL."
	default:
		return e.Field() + " is invalid."
	}
}
