package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
	service "Smaug6739/Alexandrie/services"
	"Smaug6739/Alexandrie/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserController interface {
	GetUsers(c *gin.Context)
	GetMe(c *gin.Context)
	GetUserById(c *gin.Context)
	CreateUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	UpdatePassword(c *gin.Context)
}
type UserControllerImpl struct {
	Controller
	user_service service.UserService
}

func NewUserController(app *app.App) UserController {
	return &UserControllerImpl{
		user_service: service.NewUserService(app.DB),
		Controller: Controller{
			app: app,
		},
	}
}

// Get Users
// @Summary Get all users
// @Method GET
// @Router /users [get]
// @Security Authenfification: Auth, Admin
// @Success 200 {object} Success([]models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *UserControllerImpl) GetUsers(c *gin.Context) {
	users, err := ctr.user_service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, users)
}

// GetMe
// @Summary Get current user information
// @Method GET
// @Router /users/@me [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success(models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *UserControllerImpl) GetMe(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.Error("User ID not found in context"))
		return
	}
	user, err := ctr.user_service.GetUserById(userId.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.Success(user))
}

// Get User by ID
// @Summary Get user by ID
// @Method GET
// @Router /users/{id} [get]
// @Security Authenfification: Auth, Admin
// @Param id path int true "User ID"
// @Success 200 {object} Success(models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *UserControllerImpl) GetUserById(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Invalid user ID"))
		return
	}
	user, err := ctr.user_service.GetUserById(id)
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

// Create User
// @Summary Create a new user
// @Method POST
// @Router /users [post]
// @Security None
// @Body Username*, Firstname, Lastname, Avatar, Role, Email*, Password*
// @Success 201 {object} Success(models.User)
// @Failure 400 {object} Error
func (ctr *UserControllerImpl) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error(err.Error()))
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error("Failed to hash password"))
		return
	}
	user = models.User{
		Id:               ctr.app.Snowflake.Generate(),
		Username:         user.Username,
		Firstname:        user.Firstname,
		Lastname:         user.Lastname,
		Avatar:           user.Avatar,
		Role:             1,
		Email:            user.Email,
		Password:         string(hash),
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}
	// Specific validation for username and password
	if len(user.Password) == 0 {
		c.JSON(http.StatusBadRequest, utils.Error("Password must be provided."))
		return
	}
	exists := ctr.user_service.CheckUsernameExists(user.Username)
	if exists {
		c.JSON(http.StatusBadRequest, utils.Error("Username already exists."))
		return
	}

	createdUser, err := ctr.user_service.CreateUser(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	createdUser.Password = "" // Remove password from response
	c.JSON(http.StatusCreated, createdUser)
}

// Update User
// @Summary Update user information
// @Method PATCH
// @Router /users/{id} [patch]
// @Security Authenfification: Auth
// @Param id path int true "User ID"
// @Body Username, Firstname, Lastname, Avatar, Role, Email
// @Success 200 {object} Success(models.User)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *UserControllerImpl) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Error("Invalid user ID"))
		return
	}
	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Error(err.Error()))
		return
	}

	dbUser, err := ctr.user_service.GetUserById(id)
	if err != nil || dbUser == nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	// Only update provided fields
	user = models.User{
		Id:               id,
		Username:         dbUser.Username,
		Firstname:        utils.IfNotNilOrDefault(user.Firstname, dbUser.Firstname),
		Lastname:         utils.IfNotNilOrDefault(user.Lastname, dbUser.Lastname),
		Avatar:           utils.IfNotNilOrDefault(user.Avatar, dbUser.Avatar),
		Role:             dbUser.Role,
		Email:            utils.IfNotNilOrDefault(user.Email, dbUser.Email),
		CreatedTimestamp: dbUser.CreatedTimestamp,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	updatedUser, err := ctr.user_service.UpdateUser(id, &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}

func (ctr *UserControllerImpl) UpdatePassword(c *gin.Context) {
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
	err = ctr.user_service.UpdatePassword(id, payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Error(err.Error()))
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
