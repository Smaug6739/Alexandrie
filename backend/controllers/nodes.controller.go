package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type NodeController interface {
	GetPublicNode(c *gin.Context) (int, any)
	GetSharedNodes(c *gin.Context) (int, any)
	GetNodes(c *gin.Context) (int, any)
	GetNode(c *gin.Context) (int, any)
	CreateNode(c *gin.Context) (int, any)
	UpdateNode(c *gin.Context) (int, any)
	DeleteNode(c *gin.Context) (int, any)
}

func NewNodeController(app *app.App) NodeController {
	utils.InitBluemonday()
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Repos.Permission),
	}
}

func (ctr *Controller) GetPublicNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	node, err := ctr.app.Services.Node.GetPublicNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, node
}

func (ctr *Controller) GetSharedNodes(c *gin.Context) (int, any) {
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	nodes, err := ctr.app.Services.Node.GetSharedNodes(targetUserId, connectedUserId, connectedUserRole)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, nodes
}

func (ctr *Controller) GetNodes(c *gin.Context) (int, any) {
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	nodes, err := ctr.app.Services.Node.GetAllNodes(targetUserId, connectedUserId, connectedUserRole)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, nodes
}

func (ctr *Controller) GetNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	result, err := ctr.app.Services.Node.GetNode(nodeId, connectedUserId, connectedUserRole, ctr.authorizer)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, result
}

func (ctr *Controller) CreateNode(c *gin.Context) (int, any) {
	var node models.Node
	if err := c.ShouldBind(&node); err != nil {
		return http.StatusBadRequest, err
	}
	userId, _, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	createdNode, err := ctr.app.Services.Node.CreateNode(&node, userId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, createdNode
}

func (ctr *Controller) UpdateNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	var node models.Node
	if err := c.ShouldBind(&node); err != nil {
		return http.StatusBadRequest, err
	}

	updatedNode, err := ctr.app.Services.Node.UpdateNode(nodeId, &node, connectedUserId, connectedUserRole, ctr.authorizer)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, updatedNode
}

func (ctr *Controller) DeleteNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	err = ctr.app.Services.Node.DeleteNode(nodeId, connectedUserId, connectedUserRole, ctr.authorizer)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, "OK"
}
