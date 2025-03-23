package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (ctr *Controller) GetUsers(c *gin.Context) {

	users, err := ctr.model.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
