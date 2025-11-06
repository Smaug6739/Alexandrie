package main

import (
	"alexandrie/server"
	"alexandrie/utils"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load() // Load .env file if present

	utils.SetDomainEnv() // Set DOMAIN_CLIENT and DOMAIN_COOKIE from "FRONTEND_URL" if needed
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		fmt.Fprintln(os.Stderr, "⚠️  Error: BACKEND_PORT environment variable not set")
		os.Exit(1)
	}
	server, application := server.SetupServer()

	fmt.Println("Starting server on port:", port)
	defer application.DB.Close()

	server.Run(":" + port)
}
