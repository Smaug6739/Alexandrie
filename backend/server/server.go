package server

import (
	"alexandrie/app"
	"alexandrie/logger"
	"alexandrie/router"
	"fmt"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func SetupServer() (*gin.Engine, *app.App) {

	workingDir, err := os.Getwd()
	if err != nil {
		logger.Error("Error getting cwd: " + err.Error())
		os.Exit(1)
	}
	absPath := filepath.Join(workingDir, fmt.Sprintf("%sconfig.toml", os.Getenv("CONFIG_CPWD")))
	config := app.Config{}
	_, err = toml.DecodeFile(absPath, &config)
	if err != nil {
		logger.Error("Error loading config: " + err.Error())
		os.Exit(1)
	}
	logger.Success("Loaded configuration from: " + absPath + " successfully")

	// Initialize the application
	application := app.InitApp(config)

	// Create Gin router
	appRouter := router.InitRouter(application)

	return appRouter, application
}
