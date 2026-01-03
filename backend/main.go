package main

import (
	"alexandrie/pkg/logger"
	"alexandrie/server"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	logger.Info("Initializing Alexandrie backend...")
	godotenv.Load() // Load .env file if present

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		logger.Error("BACKEND_PORT environment variable not set")
		os.Exit(1)
	}
	server, application := server.SetupServer()

	logger.Info("Starting server on port: " + port)
	defer application.DB.Close()

	server.Run(":" + port)
}
