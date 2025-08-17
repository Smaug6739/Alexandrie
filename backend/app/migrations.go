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

	db := DBConection(*config, true) // Use multiStatements for migration
	defer db.Close()
	driver, _ := mysql.WithInstance(db, &mysql.Config{})
	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", absPath),
		"mysql",
		driver,
	)
	if err != nil {
		panic(fmt.Sprintf("failed to create migrate instance: %v", err))
	}

	if err := m.Up(); err != nil && err.Error() != "no change" {
		panic(fmt.Sprintf("failed to apply migrations: %v", err))
	}
}
