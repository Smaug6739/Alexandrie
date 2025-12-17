package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/utils"
	"net/http"
	"strconv"

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
	SearchNodes(c *gin.Context) (int, any)
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

// SearchNodes performs a fulltext search on user's documents
// Query params:
//   - q: search query (required, min 2 chars)
//   - content: include content body in search (optional, default false)
//   - limit: max results (optional, default 20, max 100)
func (ctr *Controller) SearchNodes(c *gin.Context) (int, any) {
	connectedUserId, _, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	query := c.Query("q")
	if len(query) < 2 {
		return http.StatusBadRequest, "Search query must be at least 2 characters"
	}

	includeContent := c.Query("content") == "true"

	limit := 20
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	results, err := ctr.app.Services.Node.SearchNodes(connectedUserId, query, includeContent, limit)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	return http.StatusOK, results
}
