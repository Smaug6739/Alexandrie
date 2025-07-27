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
	Host := config.Database.Host
	Port := fmt.Sprint(config.Database.Port)
	Database := config.Database.Name

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
