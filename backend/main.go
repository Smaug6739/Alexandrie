package main

import "Smaug6739/Alexandrie/server"

func main() {
	server, application := server.SetupServer()
	defer application.DB.Close()

	// Démarrer le serveur sur le port 8080
	server.Run("localhost:8080")
}
