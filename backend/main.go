package main

import (
	_ "embed"
	"os"

	"alexandrie/app"
	"alexandrie/pkg/logger"
	"alexandrie/router"

	"github.com/BurntSushi/toml"
	"github.com/joho/godotenv"
)

//go:embed config.toml
var configData []byte

func main() {
	logger.Info("app", "Initializing Alexandrie backend...")

	loadEnv()

	port := os.Getenv("BACKEND_PORT")

	config := loadConfig()
	application := app.InitApp(config)
	server := router.InitRouter(application)

	logger.Info("app", "Starting server on port: "+port)
	defer application.DB.Close()

	server.Run(":" + port)
}

func loadEnv() {
	_ = godotenv.Load() // facultatif : pas d’erreur si absent

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		logger.Error("app", "BACKEND_PORT environment variable not set")
		os.Exit(1)
	}
}

func loadConfig() app.Config {
	var config app.Config

	// 1: Check for CONFIG_PATH environment variable
	if path := os.Getenv("CONFIG_PATH"); path != "" {
		if _, err := toml.DecodeFile(path, &config); err != nil {
			logger.Error("server", "Error loading config from CONFIG_PATH: "+err.Error())
			os.Exit(1)
		}

		logger.Success("server", "Configuration loaded from CONFIG_PATH: "+path)
		return config
	}

	// 2: Fallback to embedded config.toml
	if err := toml.Unmarshal(configData, &config); err != nil {
		logger.Error("server", "Error loading embedded config: "+err.Error())
		os.Exit(1)
	}

	logger.Success("server", "Embedded configuration loaded successfully")
	return config
}
