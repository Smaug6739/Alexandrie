package services

import (
	"alexandrie/models"
	"database/sql"
)

type RessourceService interface {
	GetAllUploadsByUserId(userId int64) ([]*models.Ressource, error)
	GetRessourceById(id int64) (*models.Ressource, error)
	GetUserUploadsSize(userId int64) (int64, error)
	CreateRessource(ressource *models.Ressource) (*models.Ressource, error)
	DeleteRessource(id int64) error
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

func (s *Service) GetRessourceById(id int64) (*models.Ressource, error) {
	var ressource models.Ressource
	err := s.db.QueryRow("SELECT * FROM ressources WHERE id = ?", id).Scan(&ressource.Id, &ressource.Filename, &ressource.Filesize, &ressource.Filetype, &ressource.OriginalPath, &ressource.TransformedPath, &ressource.AuthorId, &ressource.CreatedTimestamp)
	if err != nil {
		return nil, err
	}
	return &ressource, nil
}

func (s *Service) GetUserUploadsSize(userId int64) (int64, error) {
	var totalSize *int64
	err := s.db.QueryRow("SELECT SUM(file_size) FROM ressources WHERE author_id = ?", userId).Scan(&totalSize)
	if err != nil {
		return 0, err
	}
	if totalSize == nil {
		return 0, nil
	}
	return *totalSize, nil
}

func (s *Service) CreateRessource(ressource *models.Ressource) (*models.Ressource, error) {
	_, err := s.db.Exec("INSERT INTO ressources (id, filename, file_size, file_type, original_path, transformed_path, author_id, created_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ressource.Id, ressource.Filename, ressource.Filesize, ressource.Filetype, ressource.OriginalPath, ressource.TransformedPath, ressource.AuthorId, ressource.CreatedTimestamp)
	if err != nil {
		return nil, err
	}
	return ressource, nil
}

func (s *Service) DeleteRessource(id int64) error {
	_, err := s.db.Exec("DELETE FROM ressources WHERE id = ?", id)
	return err
}
