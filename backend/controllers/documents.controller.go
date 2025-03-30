package controllers

import (
	"Smaug6739/Alexandrie/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (ctr *Controller) GetAllDocuments(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	documents, err := ctr.model.GetAllDocuments(userId.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, documents)
}

func (ctr *Controller) GetDocument(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}
	document, err := ctr.model.GetDocument(id, userId.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if document == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found or unauthorized"})
		return
	}
	c.JSON(http.StatusOK, document)
}

func (ctr *Controller) AddDocument(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	document.Id = ctr.app.Snowflake.Generate()
	document.AuthorId = userId.(int64)
	err := ctr.model.AddDocument(document)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Document created successfully", "document": document})
}

func (ctr *Controller) UpdateDocument(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userId, _ := claims.(map[string]interface{})["user_id"].(float64)
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}
	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	dbDoc, err := ctr.model.GetDocument(id, int64(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if dbDoc == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found or unauthorized"})
		return
	}
	document.AuthorId = dbDoc.AuthorId
	err = ctr.model.UpdateDocument(id, document)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Document updated successfully", "document": document})
}

func (ctr *Controller) DeleteDocument(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userId, _ := claims.(map[string]interface{})["user_id"].(float64)
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	dbDoc, err := ctr.model.GetDocument(id, int64(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if dbDoc == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found or unauthorized"})
		return
	}

	err = ctr.model.DeleteDocument(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Document deleted successfully"})
}
