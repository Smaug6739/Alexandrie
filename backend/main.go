package main

import (
	"alexandrie/server"
	"fmt"
	"os"
)

func main() {
	server, application := server.SetupServer()
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		fmt.Fprintln(os.Stderr, "Error: BACKEND_PORT environment variable not set")
		os.Exit(1)
	}
	fmt.Println("Starting server on port:", port)
	fmt.Println("Configuration:")
	fmt.Println("DOMAIN_CLIENT:", os.Getenv("DOMAIN_CLIENT"))
	fmt.Println("COOKIE_DOMAIN:", os.Getenv("COOKIE_DOMAIN"))
	defer application.DB.Close()

	server.Run(":" + fmt.Sprintf("%s", port))
}
