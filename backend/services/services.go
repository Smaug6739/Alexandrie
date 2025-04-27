package services

import (
	"database/sql"

	"github.com/minio/minio-go/v7"
)

type Service struct {
	db    *sql.DB
	minio *minio.Client
}

func New(db *sql.DB) *Service {
	return &Service{db: db}
}
