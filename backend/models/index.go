package models

import "database/sql"

type Model struct {
	DB *sql.DB
}

func NewModel(db *sql.DB) *Model {
	return &Model{DB: db}
}
