package app

import (
	"fmt"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
)

func DBConnection(config Config, multiStatements bool) *sqlx.DB {
	Driver := config.Database.Driver
	User := os.Getenv("DATABASE_USER")
	Password := os.Getenv("DATABASE_PASSWORD")

	// Use environment variables for host/port/database if set, otherwise fall back to config
	Host := os.Getenv("DATABASE_HOST")
	if Host == "" {
		Host = config.Database.Host
	}

	Port := os.Getenv("DATABASE_PORT")
	if Port == "" {
		Port = fmt.Sprint(config.Database.Port)
	}

	Database := os.Getenv("DATABASE_NAME")
	if Database == "" {
		Database = config.Database.Name
	}

	multiStatementsConfig := "?multiStatements=false"
	if multiStatements {
		multiStatementsConfig = "?multiStatements=true"
	}

	dsn := User + ":" + Password + "@tcp(" + Host + ":" + Port + ")/" + Database + multiStatementsConfig
	db, err := sqlx.Connect(Driver, dsn)
	if err != nil {
		panic(fmt.Sprintf("failed to connect to database: %v", err))
	}

	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	return db
}
