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
	rows, err := db.Query("SELECT id, parent_id FROM ressources WHERE parent_id IS NOT NULL")
	// Update "created_timestamp" from ressources: set created_timestamp = created_timestamp of the parent (from documents table)
	if err != nil {
		fmt.Println("❌ Error while selecting ressources:", err)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var id, parentID int
		if err := rows.Scan(&id, &parentID); err != nil {
			fmt.Println("❌ Error while scanning rows:", err)
			continue
		}
		// Get the created_timestamp of the parent
		var createdTimestamp string
		err = db.QueryRow("SELECT created_timestamp FROM documents WHERE id = ?", parentID).Scan(&createdTimestamp)
		if err != nil {
			fmt.Println("❌ Error while getting created_timestamp of parent:", err)
			continue
		}
		// Update the created_timestamp of the child
		_, err = db.Exec("UPDATE ressources SET created_timestamp = ? WHERE id = ?", createdTimestamp, id)
		if err != nil {
			fmt.Println("❌ Error while updating created_timestamp of child:", err)
			continue
		}
		fmt.Printf("✅ Updated created_timestamp of child %d with parent %d\n", id, parentID)
	}
	fmt.Println("✅ Database migration completed successfully")
}
