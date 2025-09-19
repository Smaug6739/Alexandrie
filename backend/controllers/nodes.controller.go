package controllers

import (
	"alexandrie/app"
	"alexandrie/models"
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
		app: app,
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
	nodeId, err := utils.GetIdParam(c, c.Param("id"))
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
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	nodes, err := ctr.app.Services.Nodes.GetSharedNodes(id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, nodes
}

// Get nodes
// @Summary Get all nodes
// @Method GET
// @Router /nodes [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNodes(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	nodes, err := ctr.app.Services.Nodes.GetAllNodes(id)
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
	nodeId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	node, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	connectedUserId, err := utils.NodePermission(c, node, ctr.app.Services.Permissions, utils.READ)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	perms, err := ctr.app.Services.Permissions.GetNodePermission(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	filteredPerms := []*models.Permission{}
	for _, p := range perms {
		if p.UserId == connectedUserId || node.UserId == connectedUserId {
			filteredPerms = append(filteredPerms, p)
		}
	}
	return http.StatusOK, gin.H{"node": node, "permissions": filteredPerms}
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
	userId, err := utils.GetUserIdCtx(c)
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
	nodeId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	db_node, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	connectedUserId, err := utils.NodePermission(c, db_node, ctr.app.Services.Permissions, utils.WRITE)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	node := &models.Node{}
	if err := c.ShouldBind(node); err != nil {
		return http.StatusBadRequest, err
	}

	if db_node.UserId != connectedUserId {
		// If the user is not the owner of the node, they cannot change the owner or the parent
		node.ParentId = db_node.ParentId
		node.UserId = db_node.UserId
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
	nodeId, err := utils.GetIdParam(c, c.Param("id"))
	if err != nil {
		return http.StatusBadRequest, err
	}
	db_node, err := ctr.app.Services.Nodes.GetNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	_, err = utils.NodePermission(c, db_node, ctr.app.Services.Permissions, utils.ADMIN)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Nodes.DeleteNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, db_node
}
