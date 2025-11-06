package server

import (
	"alexandrie/app"
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
		fmt.Fprintln(os.Stderr, "Error getting cwd:", err)
		os.Exit(1)
	}
	absPath := filepath.Join(workingDir, fmt.Sprintf("%sconfig.toml", os.Getenv("CONFIG_CPWD")))
	config := app.Config{}
	_, err = toml.DecodeFile(absPath, &config)
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error loading config:", err)
		os.Exit(1)
	}
	fmt.Println("Loaded configuration from:", absPath, " successfully")

	// Initialiser l'application
	application := app.InitApp(config)

	// Créer le routeur
	appRouter := router.InitRouter(application)

	return appRouter, application
}
