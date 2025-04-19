package services

import (
	"alexandrie/models"
	"database/sql"
)

type DocumentService interface {
	GetAllDocuments(userId uint64) ([]*models.Document, error)
	GetDocument(documentId uint64) (*models.Document, error)
	CreateDocument(document *models.Document) error
	UpdateDocument(document *models.Document) error
	DeleteDocument(documentId uint64) error
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
		if err := rows.Scan(
			&document.Id,
			&document.Name,
			&document.Description,
			&document.Tags,
			&document.Category,
			&document.ParentId,
			&document.Accessibility,
			&document.AuthorId,
			&document.CreatedTimestamp,
			&document.UpdatedTimestamp); err != nil {
			return nil, err
		}
		documents = append(documents, &document)
	}
	return documents, nil
}

func (s *Service) GetDocument(documentId uint64) (*models.Document, error) {
	var document models.Document
	err := s.db.QueryRow("SELECT id, name, description, tags, category, parent_id, accessibility, content_markdown, content_html, author_id, created_timestamp, updated_timestamp FROM documents WHERE id = ?", documentId).Scan(
		&document.Id,
		&document.Name,
		&document.Description,
		&document.Tags,
		&document.Category,
		&document.ParentId,
		&document.Accessibility,
		&document.ContentMarkdown,
		&document.ContentHtml,
		&document.AuthorId,
		&document.CreatedTimestamp,
		&document.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}
	return &document, nil
}

func (s *Service) CreateDocument(document *models.Document) error {
	_, err := s.db.Exec("INSERT INTO documents (id, name, description, tags, category, parent_id, accessibility, content_markdown, content_html, author_id, created_timestamp, updated_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		document.Id,
		document.Name,
		document.Description,
		document.Tags,
		document.Category,
		document.ParentId,
		document.Accessibility,
		document.ContentMarkdown,
		document.ContentHtml,
		document.AuthorId,
		document.CreatedTimestamp,
		document.UpdatedTimestamp)
	return err
}

func (s *Service) UpdateDocument(document *models.Document) error {
	_, err := s.db.Exec("UPDATE documents SET name = ?, description = ?, tags = ?, category = ?, parent_id = ?, accessibility = ?, content_markdown = ?, content_html = ? WHERE id = ?",
		document.Name,
		document.Description,
		document.Tags,
		document.Category,
		document.ParentId,
		document.Accessibility,
		document.ContentMarkdown,
		document.ContentHtml,
		document.Id)
	return err
}

func (s *Service) DeleteDocument(documentId uint64) error {
	_, err := s.db.Exec("DELETE FROM documents WHERE id = ?", documentId)
	return err
}
