package app

import (
	"fmt"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Migrate(config *Config) {
	db := DBConection(*config, true) // Use multiStatements for migration
	defer db.Close()
	driver, _ := mysql.WithInstance(db, &mysql.Config{})
	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%smigrations", os.Getenv("CPWD")), // Use PWD to get the current working directory
		"mysql",
		driver,
	)
	if err != nil {
		panic(err.Error())
	}
	if err := m.Up(); err != nil && err.Error() != "no change" {
		panic(err.Error())
	}
}
