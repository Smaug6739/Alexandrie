package app

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Migrate(config *Config) {

	workingDir, _ := os.Getwd()
	configCpwd := os.Getenv("CONFIG_CPWD")
	if configCpwd == "" {
		configCpwd = ""
	}
	absPath := filepath.Join(workingDir, configCpwd, "migrations")

	if runtime.GOOS == "windows" {
		absPath = strings.ReplaceAll(absPath, "\\", "/")
	}

	db := DBConection(*config, true)
	defer db.Close()

	if err := db.Ping(); err != nil {
		panic(fmt.Sprintf("failed to ping database: %v", err))
	}

	driver, err := mysql.WithInstance(db, &mysql.Config{
		MigrationsTable: "schema_migrations",
	})
	if err != nil {
		panic(fmt.Sprintf("failed to create mysql driver: %v", err))
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", absPath),
		"mysql",
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
