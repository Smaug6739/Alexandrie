package main

import (
	"alexandrie/server"
	"fmt"
)

func main() {
	server, application := server.SetupServer()
	fmt.Println("Starting server on port:", application.Config.Port)
	defer application.DB.Close()

	server.Run("127.0.0.1:" + fmt.Sprintf("%d", application.Config.Port))
}
