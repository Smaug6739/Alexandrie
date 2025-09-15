package controllers

import (
	"alexandrie/app"
	"alexandrie/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type NodesController interface {
	GetNodes(c *gin.Context) (int, any)
}

func NewNodesController(app *app.App) NodesController {
	return &Controller{
		app: app,
	}
}

// Get categories
// @Summary Get all categories
// @Method GET
// @Router /categories [get]
// @Security Authenfification: Auth
// @Success 200 {object} Success([]models.Category)
// @Failure 400 {object} Error
// @Failure 401 {object} Error
func (ctr *Controller) GetNodes(c *gin.Context) (int, any) {
	id, err := utils.SelfOrPermission(c, utils.ADMINISTRATOR, "userId")
	if err != nil {
		return http.StatusUnauthorized, err
	}
	nodeId, err := utils.GetIdParam(c, c.Param("id"))

	if err != nil {
		return http.StatusUnauthorized, err
	}
	nodes, err := ctr.app.Services.Nodes.GetTree(nodeId, id)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return http.StatusOK, nodes
}
