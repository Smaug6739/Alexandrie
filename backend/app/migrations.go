package app

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Migrate(config *Config) {

	workingDir, _ := os.Getwd()
	absPath := filepath.Join(workingDir, os.Getenv("CONFIG_CPWD"), "migrations")
	absPath = filepath.ToSlash(absPath)
	db := DBConnection(*config, true) // Use multiStatements for migration
	defer db.Close()

	// Test the database connection
	if err := db.Ping(); err != nil {
		panic(fmt.Sprintf("failed to ping database: %v", err))
	}

	driver, err := mysql.WithInstance(db.DB, &mysql.Config{
		MigrationsTable: "schema_migrations",
	})
	if err != nil {
		panic(fmt.Sprintf("failed to create mysql driver: %v", err))
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", absPath),
		"alexandrie",
		driver,
	)
	if err != nil {
		panic(fmt.Sprintf("failed to create migrate instance: %v", err))
	}
	defer m.Close()

	if err := m.Up(); err != nil && err.Error() != "no change" {
		panic(fmt.Sprintf("failed to apply migrations: %v", err))
	}
}
