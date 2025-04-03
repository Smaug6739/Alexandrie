package controllers

import (
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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
		c.JSON(http.StatusUnauthorized, utils.Error("User ID not found in context"))
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
		c.JSON(http.StatusBadRequest, utils.Error("Invalid user ID"))
		return
	}
	user, err := ctr.model.GetUserById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, utils.Error("User not found"))
		return
	}
	c.JSON(http.StatusOK, utils.Success(user))
}

func (ctr *Controller) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error(err.Error()))
		return
	}

	// Specific validation for username and password
	if len(user.Password) == 0 {
		c.JSON(http.StatusBadRequest, utils.Error("Password must be provided."))
		return
	}
	exists := ctr.model.CheckUsernameExists(user.Username)
	if exists {
		c.JSON(http.StatusBadRequest, utils.Error("Username already exists."))
		return
	}

	user.Id = ctr.app.Snowflake.Generate()
	user.CreatedTimestamp = time.Now().UnixMilli()
	user.UpdatedTimestamp = time.Now().UnixMilli()
	user.Role = 1 // Default role
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error("Failed to hash password"))
		return
	}
	user.Password = string(hash)

	createdUser, err := ctr.model.CreateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	createdUser.Password = "" // Remove password from response
	c.JSON(http.StatusCreated, createdUser)
}

func (ctr *Controller) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Invalid user ID"))
		return
	}
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Invalid request payload"))
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
		c.JSON(http.StatusBadRequest, utils.Error("Invalid user ID"))
		return
	}
	var payload struct {
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Invalid request payload"))
		return
	}

	if payload.Password == "" {
		c.JSON(http.StatusBadRequest, utils.Error("Password must be provided"))
		return
	}

	err = ctr.model.UpdatePassword(id, payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
