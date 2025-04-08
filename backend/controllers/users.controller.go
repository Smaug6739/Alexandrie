package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
	"Smaug6739/Alexandrie/utils"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserController interface {
	GetUsers(c *gin.Context) (int, any)
	GetUserById(c *gin.Context) (int, any)
	CreateUser(c *gin.Context) (int, any)
	UpdateUser(c *gin.Context) (int, any)
	UpdatePassword(c *gin.Context) (int, any)
	DeleteUser(c *gin.Context) (int, any)
}

func NewUserController(app *app.App) UserController {
	return &Controller{
		app: app,
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
func (ctr *Controller) GetUsers(c *gin.Context) (int, any) {
	users, err := ctr.app.Services.UserService.GetAllUsers()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, users
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
func (ctr *Controller) GetUserById(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusBadRequest, err
	}
	user, err := ctr.app.Services.UserService.GetUserById(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if user == nil {
		return http.StatusNotFound, errors.New("user not found")
	}
	return http.StatusOK, user
}

// Create User
// @Summary Create a new user
// @Method POST
// @Router /users [post]
// @Security None
// @Body Username*, Firstname, Lastname, Avatar, Role, Email*, Password*
// @Success 201 {object} Success(models.User)
// @Failure 400 {object} Error
func (ctr *Controller) CreateUser(c *gin.Context) (int, any) {
	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		return http.StatusBadRequest, err
	}
	if len(user.Password) == 0 {
		return http.StatusBadRequest, errors.New("password must be provided")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to hash password")
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

	exists := ctr.app.Services.UserService.CheckUsernameExists(user.Username)
	if exists {
		return http.StatusBadRequest, errors.New("username already exists")
	}

	createdUser, err := ctr.app.Services.UserService.CreateUser(&user)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	createdUser.Password = "" // Remove password from response
	return http.StatusCreated, createdUser
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
func (ctr *Controller) UpdateUser(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		return http.StatusBadRequest, err
	}

	dbUser, err := ctr.app.Services.UserService.GetUserById(id)
	if err != nil || dbUser == nil {
		return http.StatusInternalServerError, err
	}
	// Only update provided fields
	user = models.User{
		Id:               id,
		Username:         dbUser.Username,
		Firstname:        utils.IfNotNilPointer(user.Firstname, dbUser.Firstname),
		Lastname:         utils.IfNotNilPointer(user.Lastname, dbUser.Lastname),
		Avatar:           utils.IfNotNilPointer(user.Avatar, dbUser.Avatar),
		Role:             dbUser.Role,
		Email:            utils.IfNotNilValue(&user.Email, dbUser.Email),
		CreatedTimestamp: dbUser.CreatedTimestamp,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	updatedUser, err := ctr.app.Services.UserService.UpdateUser(id, &user)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, updatedUser
}

// Update Password
// @Summary Update user password
// @Method PATCH
// @Router /users/{id}/password [patch]
// @Security Authenfification: Auth, {self, admin}
// @Param id path int true "User ID"
// @Body Password
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdatePassword(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	var payload struct {
		Password string `form:"password" json:"password"`
	}
	if err := c.ShouldBind(&payload); err != nil {
		return http.StatusBadRequest, errors.New("invalid request payload")
	}
	if payload.Password == "" {
		return http.StatusBadRequest, errors.New("password must be provided")
	}
	// Hash the new password
	hash, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return http.StatusInternalServerError, errors.New("failed to hash password")
	}
	err = ctr.app.Services.UserService.UpdatePassword(id, string(hash))
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "Password updated successfully"
}

// Delete User
// @Summary Delete user
// @Method DELETE
// @Router /users/{id} [delete]
// @Security Authenfification: Auth, {self, admin}
// @Param id path int true "User ID"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeleteUser(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	err = ctr.app.Services.UserService.DeleteUser(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "User deleted successfully"
}
