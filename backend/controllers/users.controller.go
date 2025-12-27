package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/utils"
	"errors"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type UserController interface {
	GetUsers(c *gin.Context) (int, any)
	GetUserById(c *gin.Context) (int, any)
	GetPublicUser(c *gin.Context) (int, any)
	CreateUser(c *gin.Context) (int, any)
	UpdateUser(c *gin.Context) (int, any)
	UpdatePassword(c *gin.Context) (int, any)
	DeleteUser(c *gin.Context) (int, any)
}

func NewUserController(app *app.App) UserController {
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
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
	users, err := ctr.app.Services.User.GetAllUsers()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, users
}

// Get public user profile by username or email
// @Summary Get public user profile by username or email
// @Method GET
// @Router /users/public/{usernameOrEmail} [get]
// @Security None
func (ctr *Controller) GetPublicUser(c *gin.Context) (int, any) {
	usernameOrEmail := c.Param("query")
	if usernameOrEmail == "" {
		return http.StatusBadRequest, errors.New("username or email is required")
	}
	users, err := ctr.app.Services.User.SearchPublicUsers(usernameOrEmail)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if len(users) == 0 {
		return http.StatusNotFound, errors.New("user not found")
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
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	if allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole); !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	result, err := ctr.app.Services.User.GetUserById(targetUserId)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, result
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

	disabled := os.Getenv("CONFIG_DISABLE_SIGNUP")

	if disabled == "true" {
		return http.StatusForbidden, errors.New("user signup is disabled")
	}

	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		return http.StatusBadRequest, err
	}

	firstname := utils.StringValue(user.Firstname)
	lastname := utils.StringValue(user.Lastname)
	avatar := utils.StringValue(user.Avatar)

	createdUser, err := ctr.app.Services.User.CreateUser(user.Username, firstname, lastname, avatar, user.Email, user.Password)
	if err != nil {
		return http.StatusBadRequest, err
	}

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
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	if allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole); !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	var user models.User
	if err := c.ShouldBind(&user); err != nil {
		return http.StatusBadRequest, err
	}

	updatedUser, err := ctr.app.Services.User.UpdateUser(targetUserId, user.Firstname, user.Lastname, user.Avatar, &user.Email)
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
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	if allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole); !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	var payload struct {
		Password string `form:"password" json:"password"`
	}
	if err := c.ShouldBind(&payload); err != nil {
		return http.StatusBadRequest, errors.New("invalid request payload")
	}

	err = ctr.app.Services.User.UpdatePassword(targetUserId, payload.Password)
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
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	if allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole); !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	err = ctr.app.Services.User.DeleteUser(targetUserId, ctr.app.Services.Minio)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "User deleted successfully"
}
