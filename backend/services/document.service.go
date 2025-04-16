package services

import (
	"alexandrie/models"
	"database/sql"
)

type DocumentService interface {
	GetAllDocuments(userId uint64) ([]*models.Document, error)
}

func NewDocumentService(db *sql.DB) DocumentService {
	return &Service{db: db}
}

func (s *Service) GetAllDocuments(userId uint64) ([]*models.Document, error) {
	var documents []*models.Document
	rows, err := s.db.Query("SELECT id, name, description, tags, category, parent_id, accessibility, author_id, created_timestamp, updated_timestamp FROM documents WHERE author_id = ? ORDER BY name", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var document models.Document
		if err := rows.Scan(&document.Id, &document.Name, &document.Description,
			&document.Tags, &document.Category, &document.ParentId, &document.Accessibility,
			&document.AuthorId, &document.CreatedTimestamp, &document.UpdatedTimestamp); err != nil {
			return nil, err
		}
		documents = append(documents, &document)
	}
	return documents, nil
}
