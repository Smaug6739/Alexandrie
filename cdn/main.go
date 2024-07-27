package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}
	r := mux.NewRouter()

	fileHandler := http.FileServer(http.Dir("../uploads"))
	r.PathPrefix("/").Handler(http.StripPrefix("/", secureFileServer(fileHandler)))

	// Middlewares pour la sécurité
	r.Use(handlers.CompressHandler)
	r.Use(handlers.CORS(handlers.AllowedOrigins([]string{os.Getenv("DOMAIN_CLIENT")}))) // Restriction de CORS
	r.Use(securityHeadersMiddleware)

	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'none'; style-src 'none'")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")

		if strings.HasPrefix(r.URL.Path, "/other") || strings.HasPrefix(r.URL.Path, "/backups") {
			w.Header().Set("Content-Disposition", "attachment; filename")
		}
		next.ServeHTTP(w, r)
	})
}

func secureFileServer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = path.Clean(r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
