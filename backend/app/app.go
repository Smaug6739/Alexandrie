package app

import (
	"alexandrie/services"
	"alexandrie/utils"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/minio/minio-go/v7"
)

type Config struct {
	Port     int
	Database struct {
		Host   string
		Port   int
		Name   string
		Driver string
	}
	Cdn struct {
		MaxSize              float64
		MaxUploadsSize       float64
		SupportedTypesImages []string
		SupportedTypes       []string
	}
	Auth struct {
		AccessTokenExpiry  int
		RefreshTokenExpiry int
	}
}

type Services struct {
	User      services.UserService
	Session   services.AuthService
	Log       services.LogService
	Document  services.DocumentService
	Category  services.CategoryService
	Ressource services.RessourceService
	Minio     services.MinioService
}

type App struct {
	DB          *sql.DB
	Snowflake   *utils.Snowflake
	Config      Config
	MinioClient *minio.Client
	Services    Services
}

func InitApp(config Config) *App {
	var app App
	app.DB = DBConection(config, false)
	app.MinioClient, _ = MinioConnection()
	app.Snowflake = utils.NewSnowflake(1609459200000)
	app.Config = config
	app.Services = Services{
		User:      services.NewUserService(app.DB),
		Session:   services.NewAuthService(app.DB),
		Log:       services.NewLogService(app.DB),
		Document:  services.NewDocumentService(app.DB),
		Category:  services.NewCategoryService(app.DB),
		Ressource: services.NewRessourceService(app.DB),
		Minio:     services.NewMinioService(app.MinioClient),
	}

	Migrate(&config)
	DB_DATA_MIGRATION(app.DB)
	return &app
}

// This function is used to migrate the database
// It will be called when the application is started
func DB_DATA_MIGRATION(db *sql.DB) {
	// Select all categories with "workspace_id" not empty
	rows, err := db.Query("SELECT id, workspace_id FROM categories WHERE workspace_id IS NOT NULL")
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()
	// Iterate over the rows
	for rows.Next() {
		var id int
		var workspace_id string
		if err := rows.Scan(&id, &workspace_id); err != nil {
			panic(err.Error())
		}
		// Update the category with the new workspace_id
		_, err = db.Exec("UPDATE categories SET parent_id = ? WHERE id = ?", workspace_id, id)
		if err != nil {
			panic(err.Error())
		}
	}
	fmt.Println("✅ Database migration completed successfully")
}
