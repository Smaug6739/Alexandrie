package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type DocumentService interface {
	GetAllDocuments(userId types.Snowflake) ([]*models.Document, error)
	GetAllDocumentBackup(authorId types.Snowflake) ([]*models.Document, error)
	GetPublicDocument(documentId types.Snowflake) (*models.Document, error)
	GetDocument(documentId types.Snowflake) (*models.Document, error)
	CreateDocument(document *models.Document) error
	UpdateDocument(document *models.Document) error
	DeleteDocument(documentId types.Snowflake) error
}

func NewDocumentService(db *sql.DB) DocumentService {
	return &Service{db: db}
}

func (s *Service) GetAllDocuments(userId types.Snowflake) ([]*models.Document, error) {
	var documents = make([]*models.Document, 0)
	rows, err := s.db.Query(`
		SELECT n.id, d.name, d.description, d.tags, d.pinned,
		       d.theme, n.icon, n.color, n.parent_id,
		       d.accessibility, d.content_markdown, d.content_html,
		       n.user_id, n.created_timestamp, n.updated_timestamp
		FROM nodes n
		JOIN documents d ON n.id = d.node_id
		WHERE n.user_id = ? AND n.role = 3
		ORDER BY d.pinned DESC, d.name
	`, userId)
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
			&document.Pinned,
			&document.Theme,
			&document.Icon,
			&document.Color,
			&document.ParentId,
			&document.Accessibility,
			&document.ContentMarkdown,
			&document.ContentHtml,
			&document.UserId,
			&document.CreatedTimestamp,
			&document.UpdatedTimestamp,
		); err != nil {
			return nil, err
		}
		documents = append(documents, &document)
	}
	return documents, nil
}

func (s *Service) GetAllDocumentBackup(authorId types.Snowflake) ([]*models.Document, error) {
	var documents = make([]*models.Document, 0)
	rows, err := s.db.Query(`
		SELECT n.id, d.name, d.description,d.tags, d.pinned, d.thumbnail,
		       d.theme, n.icon, n.color, n.parent_id,
		       d.accessibility, d.content_markdown, d.content_html,
		       n.user_id, n.created_timestamp, n.updated_timestamp
		FROM nodes n
		JOIN documents d ON n.id = d.node_id
		WHERE n.user_id = ? AND n.role = 3
	`, authorId)
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
			&document.Pinned,
			&document.Thumbnail,
			&document.Theme,
			&document.Icon,
			&document.Color,
			&document.ParentId,
			&document.Accessibility,
			&document.ContentMarkdown,
			&document.ContentHtml,
			&document.UserId,
			&document.CreatedTimestamp,
			&document.UpdatedTimestamp,
		); err != nil {
			return nil, err
		}
		documents = append(documents, &document)
	}
	return documents, nil
}

func (s *Service) GetPublicDocument(documentId types.Snowflake) (*models.Document, error) {
	var document models.Document
	err := s.db.QueryRow(`
		SELECT n.id, d.name, d.description,d.tags, d.pinned, d.thumbnail,
		       d.theme, n.icon, n.color, n.parent_id,
		       d.accessibility, d.content_markdown, d.content_html,
		       n.user_id, n.created_timestamp, n.updated_timestamp
		FROM nodes n
		JOIN documents d ON n.id = d.node_id
		WHERE n.id = ? AND d.accessibility = 3 AND n.role = 3
	`, documentId).Scan(
		&document.Id,
		&document.Name,
		&document.Description,
		&document.Tags,
		&document.Pinned,
		&document.Thumbnail,
		&document.Theme,
		&document.Icon,
		&document.Color,
		&document.ParentId,
		&document.Accessibility,
		&document.ContentMarkdown,
		&document.ContentHtml,
		&document.UserId,
		&document.CreatedTimestamp,
		&document.UpdatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &document, nil
}

func (s *Service) GetDocument(documentId types.Snowflake) (*models.Document, error) {
	var document models.Document
	err := s.db.QueryRow(`
		SELECT n.id, d.name, d.description,d.tags, d.pinned, d.thumbnail,
		       d.theme, n.icon, n.color, n.parent_id,
		       d.accessibility, d.content_markdown, d.content_html,
		       n.user_id, n.created_timestamp, n.updated_timestamp
		FROM nodes n
		JOIN documents d ON n.id = d.node_id
		WHERE n.id = ? AND n.role = 3
	`, documentId).Scan(
		&document.Id,
		&document.Name,
		&document.Description,
		&document.Tags,
		&document.Pinned,
		&document.Thumbnail,
		&document.Theme,
		&document.Icon,
		&document.Color,
		&document.ParentId,
		&document.Accessibility,
		&document.ContentMarkdown,
		&document.ContentHtml,
		&document.UserId,
		&document.CreatedTimestamp,
		&document.UpdatedTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &document, nil
}

func (s *Service) CreateDocument(document *models.Document) error {
	// insert node
	_, err := s.db.Exec(`
		INSERT INTO nodes (id, user_id, role, parent_id, icon, color, created_timestamp, updated_timestamp)
		VALUES (?, ?, 3, ?, ?, ?, ?, ?)
	`,
		document.Id,
		document.UserId,
		document.ParentId,
		document.Icon,
		document.Color,
		document.CreatedTimestamp,
		document.UpdatedTimestamp,
	)
	if err != nil {
		return err
	}

	// insert content
	_, err = s.db.Exec(`
		INSERT INTO documents (node_id, name, description, tags, pinned, thumbnail, theme, accessibility, content_markdown, content_html)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		document.Id,
		document.Name,
		document.Description,
		document.Tags,
		document.Pinned,
		document.Thumbnail,
		document.Theme,
		document.Accessibility,
		document.ContentMarkdown,
		document.ContentHtml,
	)
	return err
}

func (s *Service) UpdateDocument(document *models.Document) error {
	_, err := s.db.Exec(`
		UPDATE nodes
		SET icon = ?, color = ?, parent_id = ?, updated_timestamp = ?
		WHERE id = ?
	`,
		document.Icon,
		document.Color,
		document.ParentId,
		document.UpdatedTimestamp,
		document.Id,
	)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(`
		UPDATE documents
		SET name = ?, description = ?, tags = ?, pinned = ?, thumbnail = ?,
		    theme = ?, accessibility = ?, content_markdown = ?, content_html = ?
		WHERE node_id = ?
	`,
		document.Name,
		document.Description,
		document.Tags,
		document.Pinned,
		document.Thumbnail,
		document.Theme,
		document.Accessibility,
		document.ContentMarkdown,
		document.ContentHtml,
		document.Id,
	)
	return err
}

func (s *Service) DeleteDocument(documentId types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM nodes WHERE id = ?", documentId)
	return err
}
