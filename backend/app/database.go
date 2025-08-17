package app

import (
	"database/sql"
	"fmt"
	"os"
	"time"
)

func DBConection(config Config, multiStatements bool) (conecction *sql.DB) {
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

	conection, err := sql.Open(Driver, User+":"+Password+"@tcp("+Host+":"+Port+")/"+Database+multiStatementsConfig)

	if err != nil {
		panic(fmt.Sprintf("failed to connect to database: %v", err))
	}
	conection.SetConnMaxLifetime(time.Minute * 3)
	conection.SetMaxOpenConns(10)
	conection.SetMaxIdleConns(10)
	return conection
}
