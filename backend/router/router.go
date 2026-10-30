package router

import (
	"alexandrie/app"
	"alexandrie/router/routes"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// For development only - fake delay for dev to test reactivity

/*
		func DelayMiddleware(delay time.Duration) gin.HandlerFunc {
		return func(c *gin.Context) {
			time.Sleep(delay)
			c.Next()
		}
	}
*/
func InitRouter(app *app.App) *gin.Engine {
	router := gin.New()

	router.Use(gin.Recovery())
	//router.Use(DelayMiddleware(250 * time.Millisecond))

	// Config proxy and CORS
	router.SetTrustedProxies([]string{"127.0.0.1", "localhost"})
	router.Use(cors.New(frontendCORSConfig(os.Getenv("FRONTEND_URL"))))

	mainGroup := router.Group("/api")
	routes.Users(app, mainGroup)
	routes.UserSettings(app, mainGroup)
	routes.Auth(app, mainGroup)
	routes.Uploads(app, mainGroup)
	routes.Backup(app, mainGroup)
	routes.Nodes(app, mainGroup)
	routes.Stats(app, mainGroup)
	return router
}

func frontendCORSConfig(frontendURL string) cors.Config {
	// Only the frontend application may read credentialed API responses. Public
	// asset hosts can serve user-controlled content and must not be trusted here.
	frontendOrigin := strings.TrimSuffix(strings.TrimSpace(frontendURL), "/")
	return cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return frontendOrigin != "" && origin == frontendOrigin
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}
}
