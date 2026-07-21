package controllers

import (
	"alexandrie/permissions"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func actorFromRequest(c *gin.Context) (permissions.Actor, error) {
	actor, ok := permissions.ActorFromContext(c.Request.Context())
	if !ok || actor.UserID == 0 {
		return permissions.Actor{}, permissions.ErrUnauthorized
	}
	return actor, nil
}

func statusFromAccessError(err error) int {
	if errors.Is(err, permissions.ErrUnauthorized) {
		return http.StatusUnauthorized
	}
	if errors.Is(err, permissions.ErrForbidden) {
		return http.StatusForbidden
	}
	if errors.Is(err, permissions.ErrNotFound) {
		return http.StatusNotFound
	}
	if errors.Is(err, permissions.ErrInvalidPassword) {
		return http.StatusBadRequest
	}
	if errors.Is(err, permissions.ErrIncorrectPassword) {
		return http.StatusUnauthorized
	}
	return http.StatusInternalServerError
}
