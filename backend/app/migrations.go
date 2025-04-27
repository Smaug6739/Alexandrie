package app

import (
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Migrate(config *Config) {
	db := DBConection(*config, true) // Use multiStatements for migration
	defer db.Close()
	driver, _ := mysql.WithInstance(db, &mysql.Config{})
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
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
