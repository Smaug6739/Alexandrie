package services

import (
	"alexandrie/models"
	"database/sql"
)

type RessourceService interface {
	GetAllUploadsByUserId(userId int64) ([]*models.Ressource, error)
	GetUserUploadsSize(userId int64) (int64, error)
	CreateRessource(ressource *models.Ressource) (*models.Ressource, error)
}

func NewRessourceService(db *sql.DB) RessourceService {
	return &Service{db: db}
}

func (s *Service) GetAllUploadsByUserId(userId int64) ([]*models.Ressource, error) {
	var ressources []*models.Ressource
	rows, err := s.db.Query("SELECT * from ressources WHERE author_id = ?", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var ressource models.Ressource
		if err := rows.Scan(&ressource.Id, &ressource.Filename, &ressource.Filesize, &ressource.Filetype, &ressource.OriginalPath, &ressource.TransformedPath, &ressource.AuthorId, &ressource.CreatedTimestamp); err != nil {
			return nil, err
		}
		ressources = append(ressources, &ressource)
	}
	return ressources, nil
}

func (s *Service) CreateRessource(ressource *models.Ressource) (*models.Ressource, error) {
	_, err := s.db.Exec("INSERT INTO ressources (id, filename, file_size, file_type, original_path, transformed_path, author_id, created_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ressource.Id, ressource.Filename, ressource.Filesize, ressource.Filetype, ressource.OriginalPath, ressource.TransformedPath, ressource.AuthorId, ressource.CreatedTimestamp)
	if err != nil {
		return nil, err
	}
	return ressource, nil
}

func (s *Service) GetUserUploadsSize(userId int64) (int64, error) {
	var totalSize int64
	err := s.db.QueryRow("SELECT SUM(file_size) FROM ressources WHERE author_id = ?", userId).Scan(&totalSize)
	if err != nil {
		return 0, err
	}
	return totalSize, nil
}
