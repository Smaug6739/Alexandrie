package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/utils"
	"net/http"

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

// GetNodePermissions retrieves permissions for a specific node
// @Method GET
// @Description Retrieve permissions for a specific node.
// @Param nodeId path string true "Node ID"
// @Router /permissions/node/{nodeId} [get]
func (ctr *Controller) GetNodePermissions(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("nodeId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	perms, err := ctr.app.Services.Permission.GetNodePermissions(c.Request.Context(), nodeId)
	if err != nil {
		return statusFromAccessError(err), err
	}
	return http.StatusOK, perms
}

// CreatePermission creates a new permission for a node
// @Method POST
// @Description Create a new permission for a node.
// @Router /permissions [post]
func (ctr *Controller) CreatePermission(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("nodeId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	var perm models.Permission
	if err := c.ShouldBindJSON(&perm); err != nil {
		return http.StatusBadRequest, err
	}
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	createdPerm, err := ctr.app.Services.Permission.CreatePermission(c.Request.Context(), nodeId, perm.UserId, perm.Permission)
	if err != nil {
		return statusFromAccessError(err), err
	}
	return http.StatusOK, createdPerm
}

// UpdatePermission updates an existing permission for a node
// @Method PUT
// @Description Update an existing permission for a node.
// @Param id path string true "Permission ID"
// @Router /permissions/{id} [put]
func (ctr *Controller) UpdatePermission(c *gin.Context) (int, any) {
	permId, err := utils.GetTargetId(c, c.Param("permId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	var requestChange models.Permission
	if err := c.ShouldBindJSON(&requestChange); err != nil {
		return http.StatusBadRequest, err
	}

	err = ctr.app.Services.Permission.UpdatePermission(c.Request.Context(), permId, requestChange.Permission)
	if err != nil {
		return statusFromAccessError(err), err
	}
	return http.StatusOK, "Permission updated"
}

// DeletePermission deletes a permission by its ID
// @Method DELETE
// @Description Delete a permission by its ID.
// @Param id path string true "Permission ID"
// @Router /permissions/{id} [delete]
func (ctr *Controller) DeletePermission(c *gin.Context) (int, any) {
	permId, err := utils.GetTargetId(c, c.Param("permId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	if _, err := actorFromRequest(c); err != nil {
		return statusFromAccessError(err), err
	}

	err = ctr.app.Services.Permission.DeletePermission(c.Request.Context(), permId)
	if err != nil {
		return statusFromAccessError(err), err
	}
	return http.StatusOK, "Permission deleted"
}
