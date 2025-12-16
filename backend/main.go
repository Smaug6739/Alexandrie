package main

import (
	"alexandrie/logger"
	"alexandrie/server"
	"alexandrie/utils"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	logger.Info("Initializing Alexandrie backend...")
	godotenv.Load() // Load .env file if present

	utils.SetDomainEnv() // Set DOMAIN_CLIENT and DOMAIN_COOKIE from "FRONTEND_URL" if needed
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		logger.Error("BACKEND_PORT environment variable not set")
		os.Exit(1)
	}
	server, application := server.SetupServer()

	logger.Info("Starting server on port: " + port)
	defer application.DB.Close()

	server.Run("localhost:" + port)
}
