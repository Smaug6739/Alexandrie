package controllers

import (
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (ctr *Controller) GetUsers(c *gin.Context) {

	users, err := ctr.model.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, users)
}

func (ctr *Controller) GetMe(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	user, err := ctr.model.GetUserById(userId.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.Success(user))
}

func (ctr *Controller) GetUserById(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	user, err := ctr.model.GetUserById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, utils.Success(user))
}

func (ctr *Controller) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	createdUser, err := ctr.model.CreateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusCreated, createdUser)
}

func (ctr *Controller) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	updatedUser, err := ctr.model.UpdateUser(id, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}

func (ctr *Controller) UpdatePassword(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	var payload struct {
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if payload.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be provided"})
		return
	}

	err = ctr.model.UpdatePassword(id, payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
