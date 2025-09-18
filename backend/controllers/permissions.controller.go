package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type PermissionsController interface {
	GetNodePermissions(c *gin.Context) (int, any)
	CreatePermission(c *gin.Context) (int, any)
	UpdatePermission(c *gin.Context) (int, any)
	DeletePermission(c *gin.Context) (int, any)
}

func NewPermissionsController(app *app.App) PermissionsController {
	return &Controller{
		app: app,
	}
}

// Get node permissions by id
// @Summary Get all node permissions by id
// @Method GET
// @Router /permissions/{nodeId} [get]
// @Security Authenfification: Auth
// @Param nodeId path string true "Node ID"
// @Success 200 {object} Success([]models.Permission)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNodePermissions(c *gin.Context) (int, any) {
	nodeId, err := utils.GetIdParam(c, c.Param("nodeId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	_, err = utils.NodePermission(c, node, ctr.app.Services.Permissions, utils.OWNER)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	perms, err := ctr.app.Services.Permissions.GetNodePermission(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, perms
}

// Create permission
// @Summary Create permission
// @Method POST
// @Router /permissions [post]
// @Security Authenfification: Auth
// @Body permission body models.Permission true "Permission"
// @Success 200 {object} Success(models.Permission)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) CreatePermission(c *gin.Context) (int, any) {
	perm := &models.Permission{}
	if err := c.ShouldBindJSON(perm); err != nil {
		return http.StatusBadRequest, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(perm.NodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	_, err = utils.NodePermission(c, node, ctr.app.Services.Permissions, utils.OWNER)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	perm = &models.Permission{
		Id:               ctr.app.Snowflake.Generate(),
		NodeId:           perm.NodeId,
		UserId:           perm.UserId,
		Permission:       perm.Permission,
		CreatedTimestamp: time.Now().UnixMilli(),
	}
	err = ctr.app.Services.Permissions.CreatePermission(perm)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, perm
}

// Update permission
// @Summary Update permission
// @Method PUT
// @Router /permissions/{id} [put]
// @Security Authenfification: Auth
// @Param id path string true "Permissions ID"
// @Body node body models.Permissions true "Permissions"
// @Success 200 {object} Success(models.Permissions)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdatePermission(c *gin.Context) (int, any) {
	permId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	perm, err := ctr.app.Services.Permissions.GetPermission(permId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(perm.NodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	_, err = utils.NodePermission(c, node, ctr.app.Services.Permissions, utils.OWNER)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	requestChange := &models.Permission{}
	if err := c.ShouldBindJSON(requestChange); err != nil {
		return http.StatusBadRequest, err
	}
	err = ctr.app.Services.Permissions.UpdatePermission(permId, requestChange.Permission)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return 0, nil
}

// Delete permission
// @Summary Delete permission
// @Method DELETE
// @Router /permissions/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "Permissions ID"
// @Success 200 {object} Success(string)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeletePermission(c *gin.Context) (int, any) {
	permId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	perm, err := ctr.app.Services.Permissions.GetPermission(permId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(perm.NodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	_, err = utils.NodePermission(c, node, ctr.app.Services.Permissions, utils.OWNER)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Permissions.DeletePermission(permId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "Permission deleted"
}
