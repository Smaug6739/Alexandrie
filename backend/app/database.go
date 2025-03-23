package app

import (
	"database/sql"
	"time"
)

func DBConection() (conecction *sql.DB) {
	Driver := "mysql"
	User := "root"
	Password := "root"
	Host := "localhost"
	Port := "3306"
	Database := "alexandrie"

	conection, err := sql.Open(Driver, User+":"+Password+"@tcp("+Host+":"+Port+")/"+Database)

	if err != nil {
		panic(err.Error())
	}
	conection.SetConnMaxLifetime(time.Minute * 3)
	conection.SetMaxOpenConns(10)
	conection.SetMaxIdleConns(10)
	return conection
}
