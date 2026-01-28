package app

import (
	"alexandrie/pkg/logger"
	"embed"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func Migrate(config *Config) {

	db := DBConnection(*config, true) // Use multiStatements for migration
	defer db.Close()

	// Test the database connection
	if err := db.Ping(); err != nil {
		logger.Error("database", "Failed to ping database: "+err.Error())
		panic(err)
	}

	driver, err := mysql.WithInstance(db.DB, &mysql.Config{
		MigrationsTable: "schema_migrations",
	})
	if err != nil {
		panic(fmt.Sprintf("failed to create mysql driver: %v", err))
	}

	source, err := iofs.New(migrationsFS, "migrations")
	if err != nil {
		panic(fmt.Sprintf("failed to create iofs source: %v", err))
	}

	m, err := migrate.NewWithInstance(
		"iofs",
		source,
		config.Database.Driver,
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
