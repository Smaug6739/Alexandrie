package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type RessourceService interface {
	GetAllUploadsByUserId(userId types.Snowflake) ([]*models.Ressource, error)
	GetRessourceById(id types.Snowflake) (*models.Ressource, error)
	GetUserUploadsSize(userId types.Snowflake) (int64, error)
	CreateRessource(ressource *models.Ressource) (*models.Ressource, error)
	UpdateRessource(ressource *models.Ressource) (*models.Ressource, error)
	DeleteRessource(id types.Snowflake) error
}

func NewRessourceService(db *sql.DB) RessourceService {
	return &Service{db: db}
}

func (s *Service) GetAllUploadsByUserId(userId types.Snowflake) ([]*models.Ressource, error) {
	var ressources = make([]*models.Ressource, 0)
	rows, err := s.db.Query(`
		SELECT n.id, r.filename, r.file_size, r.file_type, r.original_path, r.transformed_path,
		       n.parent_id, n.user_id, n.created_timestamp
		FROM nodes n
		JOIN ressources r ON n.id = r.node_id
		WHERE n.user_id = ? AND n.role = 4
		ORDER BY n.created_timestamp DESC
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var ressource models.Ressource
		if err := rows.Scan(
			&ressource.Id,
			&ressource.Filename,
			&ressource.Filesize,
			&ressource.Filetype,
			&ressource.OriginalPath,
			&ressource.TransformedPath,
			&ressource.ParentId,
			&ressource.UserId,
			&ressource.CreatedTimestamp,
		); err != nil {
			return nil, err
		}
		ressources = append(ressources, &ressource)
	}
	return ressources, nil
}

func (s *Service) GetRessourceById(id types.Snowflake) (*models.Ressource, error) {
	var ressource models.Ressource
	err := s.db.QueryRow(`
		SELECT n.id, r.filename, r.file_size, r.file_type, r.original_path, r.transformed_path,
		       n.parent_id, n.user_id, n.created_timestamp
		FROM nodes n
		JOIN ressources r ON n.id = r.node_id
		WHERE n.id = ? AND n.role = 4
	`, id).Scan(
		&ressource.Id,
		&ressource.Filename,
		&ressource.Filesize,
		&ressource.Filetype,
		&ressource.OriginalPath,
		&ressource.TransformedPath,
		&ressource.ParentId,
		&ressource.UserId,
		&ressource.CreatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &ressource, nil
}

func (s *Service) GetUserUploadsSize(userId types.Snowflake) (int64, error) {
	var totalSize *int64
	err := s.db.QueryRow(`
		SELECT SUM(r.file_size)
		FROM nodes n
		JOIN ressources r ON n.id = r.node_id
		WHERE n.user_id = ? AND n.role = 4
	`, userId).Scan(&totalSize)
	if err != nil {
		return 0, err
	}
	if totalSize == nil {
		return 0, nil
	}
	return *totalSize, nil
}

func (s *Service) CreateRessource(ressource *models.Ressource) (*models.Ressource, error) {
	// insert node
	_, err := s.db.Exec(`
		INSERT INTO nodes
		(id, role, parent_id, user_id, created_timestamp)
		VALUES (?, 4, ?, ?, ?)
	`, ressource.Id, ressource.ParentId, ressource.UserId, ressource.CreatedTimestamp)
	if err != nil {
		return nil, err
	}

	// insert content
	_, err = s.db.Exec(`
		INSERT INTO ressources
		(node_id, filename, file_size, file_type, original_path, transformed_path)
		VALUES (?, ?, ?, ?, ?, ?)
	`, ressource.Id, ressource.Filename, ressource.Filesize, ressource.Filetype, ressource.OriginalPath, ressource.TransformedPath)
	if err != nil {
		return nil, err
	}

	return ressource, nil
}

func (s *Service) UpdateRessource(ressource *models.Ressource) (*models.Ressource, error) {
	_, err := s.db.Exec(`
		UPDATE nodes
		SET parent_id = ?, updated_timestamp = ?
		WHERE id = ?
	`, ressource.ParentId, ressource.CreatedTimestamp, ressource.Id)
	if err != nil {
		return nil, err
	}

	_, err = s.db.Exec(`
		UPDATE ressources
		SET filename = ?, file_size = ?, file_type = ?, original_path = ?, transformed_path = ?
		WHERE node_id = ?
	`, ressource.Filename, ressource.Filesize, ressource.Filetype, ressource.OriginalPath, ressource.TransformedPath, ressource.Id)
	if err != nil {
		return nil, err
	}

	return ressource, nil
}

func (s *Service) DeleteRessource(id types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM nodes WHERE id = ?", id)
	return err
}
