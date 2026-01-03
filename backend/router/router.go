package router

import (
	"alexandrie/app"
	"alexandrie/router/routes"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Fake delay for dev to test reactivity

//	func DelayMiddleware(delay time.Duration) gin.HandlerFunc {
//		return func(c *gin.Context) {
//			time.Sleep(delay)
//			c.Next()
//		}
//	}
func InitRouter(app *app.App) *gin.Engine {
	router := gin.New()

	router.Use(gin.Recovery())
	//router.Use(DelayMiddleware(250 * time.Millisecond))
	// Config proxy and CORS
	router.SetTrustedProxies([]string{"127.0.0.1", "localhost"})
	router.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Main domain from environment variable
			domain := os.Getenv("FRONTEND_URL")

			if origin == domain {
				return true
			}

			// Allow all sub domains (www, api, etc.)
			// simple example for mondomaine.com
			// remove the protocol for comparison
			originHost := origin
			if len(originHost) > 0 {
				// remove the protocol
				if idx := len("http://"); len(originHost) > idx && originHost[:7] == "http://" {
					originHost = originHost[7:]
				} else if idx := len("https://"); len(originHost) > idx && originHost[:8] == "https://" {
					originHost = originHost[8:]
				}
			}

			mainDomain := domain
			if len(mainDomain) > 0 {
				if idx := len("http://"); len(mainDomain) > idx && mainDomain[:7] == "http://" {
					mainDomain = mainDomain[7:]
				} else if idx := len("https://"); len(mainDomain) > idx && mainDomain[:8] == "https://" {
					mainDomain = mainDomain[8:]
				}
			}

			// Allow all sub domains
			return len(originHost) >= len(mainDomain) && originHost[len(originHost)-len(mainDomain):] == mainDomain
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	mainGroup := router.Group("/api")
	routes.Users(app, mainGroup)
	routes.Auth(app, mainGroup)
	routes.Uploads(app, mainGroup)
	routes.Backup(app, mainGroup)
	routes.Nodes(app, mainGroup)
	return router
}
