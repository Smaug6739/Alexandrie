package main

import (
	"alexandrie/server"
	"fmt"
)

func main() {
	server, application := server.SetupServer()
	defer application.DB.Close()

	server.Run("localhost:" + fmt.Sprintf("%d", application.Config.Port))
}
