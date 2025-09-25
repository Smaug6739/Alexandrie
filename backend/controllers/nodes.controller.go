package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/utils"
	"net/http"
	"time"

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
	return &Controller{
		app:        app,
		authorizer: permissions.NewAuthorizer(app.Services.Permissions),
	}
}

// Get public node by id
// @Summary Get public node by id
// @Method GET
// @Router /nodes/public/{id} [get]
// @Security Authenfification: None
// @Param id path string true "Node ID"
// @Success 200 {object} Success(models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetPublicNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	node, err := ctr.app.Services.Nodes.GetPublicNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, node
}

// Get shared nodes
// @Summary Get all shared nodes
// @Method GET
// @Router /nodes/shared/:userId [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetSharedNodes(c *gin.Context) (int, any) {
	// Get connected user ID and role from context
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	// Target user ID from param
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole)
	if !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	nodes, err := ctr.app.Services.Nodes.GetSharedNodes(targetUserId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, nodes
}

// Get nodes
// @Summary Get all nodes
// @Method GET
// @Router /nodes/:userId [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNodes(c *gin.Context) (int, any) {
	// Get connected user ID and role from context
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	// Target user ID from param
	targetUserId, err := utils.GetTargetId(c, c.Param("userId"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	allowed, err := ctr.authorizer.CanAccessUser(connectedUserId, targetUserId, connectedUserRole)
	if !allowed || err != nil {
		return http.StatusUnauthorized, err
	}

	nodes, err := ctr.app.Services.Nodes.GetAllNodes(targetUserId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, nodes
}

// Get node by id
// @Summary Get node by id
// @Method GET
// @Router /nodes/{id} [get]
// @Security Authenfification: Auth
// @Param id path string true "Node ID"
// @Success 200 {object} Success(models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	dbNode, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	// Get connected user ID and role from context
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	allowed, _, err := ctr.authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionRead)
	if !allowed || err != nil {
		return http.StatusUnauthorized, err
	}
	perms, err := ctr.app.Services.Permissions.GetNodePermission(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	filteredPerms := []*models.Permission{}
	for _, p := range perms {
		if p.UserId == connectedUserId || dbNode.UserId == connectedUserId {
			filteredPerms = append(filteredPerms, p)
		}
	}
	return http.StatusOK, gin.H{"node": dbNode, "permissions": filteredPerms}
}

// Create node
// @Summary Create node
// @Method POST
// @Router /nodes [post]
// @Security Authenfification: Auth
// @Body node body models.Node true "Node"
// @Success 200 {object} Success(models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) CreateNode(c *gin.Context) (int, any) {
	node := &models.Node{}
	if err := c.ShouldBind(node); err != nil {
		return http.StatusBadRequest, err
	}
	userId, _, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	node = &models.Node{
		Id:               ctr.app.Snowflake.Generate(),
		ParentId:         node.ParentId,
		UserId:           userId,
		Name:             node.Name,
		Description:      node.Description,
		Role:             node.Role,
		Tags:             node.Tags,
		Thumbnail:        node.Thumbnail,
		Theme:            node.Theme,
		Icon:             node.Icon,
		Color:            node.Color,
		Accessibility:    node.Accessibility,
		Access:           node.Access,
		Display:          node.Display,
		Order:            node.Order,
		Content:          node.Content,
		ContentCompiled:  node.ContentCompiled,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}
	err = ctr.app.Services.Nodes.CreateNode(node)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, node
}

// Update node
// @Summary Update node
// @Method PUT
// @Router /nodes/{id} [put]
// @Security Authenfification: Auth
// @Param id path string true "Node ID"
// @Body node body models.Node true "Node"
// @Success 200 {object} Success(models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) UpdateNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Get connected user ID and role from context
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	dbNode, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	allowed, level, err := ctr.authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionUpdate)

	// Special case: The document is public (accessibility = 3) and access < 2 (write or admin)
	if !allowed && (dbNode.Access < 2 || *dbNode.Accessibility != 3) {
		return http.StatusUnauthorized, err
	}
	node := &models.Node{}
	if err := c.ShouldBind(node); err != nil {
		return http.StatusBadRequest, err
	}

	if dbNode.UserId != connectedUserId && level < permissions.PermOwner {
		// If the user is not owner or admin of the node he cannot change some fields
		node.ParentId = dbNode.ParentId
		node.UserId = dbNode.UserId
		node.Accessibility = dbNode.Accessibility
		node.Access = dbNode.Access
	}
	node = &models.Node{
		Id:               nodeId,
		ParentId:         node.ParentId,
		UserId:           node.UserId,
		Name:             node.Name,
		Description:      node.Description,
		Tags:             node.Tags,
		Role:             node.Role,
		Thumbnail:        node.Thumbnail,
		Theme:            node.Theme,
		Icon:             node.Icon,
		Color:            node.Color,
		Accessibility:    node.Accessibility,
		Access:           node.Access,
		Display:          node.Display,
		Order:            node.Order,
		Content:          node.Content,
		ContentCompiled:  node.ContentCompiled,
		Metadata:         node.Metadata,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	err = ctr.app.Services.Nodes.UpdateNode(node)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, node
}

// Delete node
// @Summary Delete node
// @Method DELETE
// @Router /nodes/{id} [delete]
// @Security Authenfification: Auth
// @Param id path string true "Node ID"
// @Success 200 {object} Success(models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) DeleteNode(c *gin.Context) (int, any) {
	nodeId, err := utils.GetTargetId(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}

	// Get connected user ID and role from context
	connectedUserId, connectedUserRole, err := utils.GetUserContext(c)
	if err != nil {
		return http.StatusUnauthorized, err
	}

	dbNode, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	allowed, _, err := ctr.authorizer.CanAccessNode(connectedUserId, connectedUserRole, dbNode, permissions.ActionDelete)
	if !allowed || err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Nodes.DeleteNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, "OK"
}
