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

// Get nodes
// @Summary Get all nodes
// @Method GET
// @Router /nodes [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Node)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNodes(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR, "userId")
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
	err = utils.RessourceAccess(c, node.UserId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	return http.StatusOK, node
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
	err = utils.RessourceAccess(c, db_node.UserId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	node := &models.Node{}
	if err := c.ShouldBind(node); err != nil {
		return http.StatusBadRequest, err
	}
	node = &models.Node{
		Id:               nodeId,
		Name:             node.Name,
		Role:             db_node.Role,
		Description:      node.Description,
		Tags:             node.Tags,
		Thumbnail:        node.Thumbnail,
		Theme:            node.Theme,
		Icon:             node.Icon,
		Color:            node.Color,
		ParentId:         node.ParentId,
		Accessibility:    node.Accessibility,
		Display:          node.Display,
		Order:            node.Order,
		Content:          node.Content,
		ContentCompiled:  node.ContentCompiled,
		UserId:           db_node.UserId,
		CreatedTimestamp: time.Now().UnixMilli(),
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
	err = utils.RessourceAccess(c, db_node.UserId)
	if err != nil {
		return http.StatusUnauthorized, err
	}
	err = ctr.app.Services.Nodes.DeleteNode(nodeId)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, db_node
}
