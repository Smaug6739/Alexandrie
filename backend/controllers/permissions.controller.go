package controllers

import (
"alexandrie/app"
"alexandrie/models"
"alexandrie/permissions"
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
app:        app,
authorizer: permissions.NewAuthorizer(app.Repos.Permission),
}
}

func (ctr *Controller) GetNodePermissions(c *gin.Context) (int, any) {
nodeId, err := utils.GetTargetId(c, c.Param("nodeId"))
if err != nil {
return http.StatusBadRequest, err
}
connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
if err != nil {
return http.StatusUnauthorized, err
}

perms, err := ctr.app.Services.Permission.GetNodePermissions(nodeId, connectedUserId, connectedUserRole, ctr.authorizer)
if err != nil {
return http.StatusUnauthorized, err
}
return http.StatusOK, perms
}

func (ctr *Controller) CreatePermission(c *gin.Context) (int, any) {
var perm models.Permission
if err := c.ShouldBindJSON(&perm); err != nil {
return http.StatusBadRequest, err
}
connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
if err != nil {
return http.StatusUnauthorized, err
}

createdPerm, err := ctr.app.Services.Permission.CreatePermission(perm.NodeId, perm.UserId, perm.Permission, connectedUserId, connectedUserRole, ctr.authorizer)
if err != nil {
return http.StatusUnauthorized, err
}
return http.StatusOK, createdPerm
}

func (ctr *Controller) UpdatePermission(c *gin.Context) (int, any) {
permId, err := utils.GetTargetId(c, c.Param("id"))
if err != nil {
return http.StatusBadRequest, err
}
connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
if err != nil {
return http.StatusUnauthorized, err
}

var requestChange models.Permission
if err := c.ShouldBindJSON(&requestChange); err != nil {
return http.StatusBadRequest, err
}

err = ctr.app.Services.Permission.UpdatePermission(permId, requestChange.Permission, connectedUserId, connectedUserRole, ctr.authorizer)
if err != nil {
return http.StatusUnauthorized, err
}
return http.StatusOK, "Permission updated"
}

func (ctr *Controller) DeletePermission(c *gin.Context) (int, any) {
permId, err := utils.GetTargetId(c, c.Param("id"))
if err != nil {
return http.StatusBadRequest, err
}
connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
if err != nil {
return http.StatusUnauthorized, err
}

err = ctr.app.Services.Permission.DeletePermission(permId, connectedUserId, connectedUserRole, ctr.authorizer)
if err != nil {
return http.StatusUnauthorized, err
}
return http.StatusOK, "Permission deleted"
}
