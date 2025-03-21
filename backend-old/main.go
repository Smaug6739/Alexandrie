package main

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
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
func main() {
	db := DBConection()
	defer db.Close()

rows, err := db.Query("SELECT * FROM users")
    if err != nil {
        // handle error
				fmt.Println(err)
				panic(err)
    }
    defer rows.Close()

    // process the query results
    for rows.Next() {
        // scan the row into a variable
        var id int
        var username string
        var firstname string
        var lastname string
        var role string
        var avatar string
        var email string
        var password string
        var created_timestamp string
        var updated_timestamp string
        err = rows.Scan(&id, &username, &firstname,&lastname,&role,&avatar,&email,&password,&created_timestamp,&updated_timestamp)
        if err != nil {
            // handle error
        }

        // do something with the data
        fmt.Printf("id: %d, name: %s\n", id, username)
    }

    // check for errors from iterating over rows.Next()
    if err = rows.Err(); err != nil {
        // handle error
    }

	//router.Init()


}

