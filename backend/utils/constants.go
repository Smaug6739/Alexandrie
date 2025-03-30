package utils

import "github.com/golang-jwt/jwt/v5"

type AuthClaims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}
