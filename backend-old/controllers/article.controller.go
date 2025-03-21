package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)


type Person struct {
	Name string
	Age int
	City string
	Pincode int
}

func GetDocument(c *gin.Context) {
	data := Person{
		Name:    "Mark",
		Age:     30,
		City:    "NY",
		Pincode: 777,
	}
	c.JSON(http.StatusOK, gin.H{
		"Data": data,
	})
}
