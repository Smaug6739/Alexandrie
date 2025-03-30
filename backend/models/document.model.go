package models

import (
	"database/sql"
	"errors"
)

type Document struct {
	Id               int64   `json:"id"`
	Name             string  `json:"name"`
	Description      *string `json:"description"`
	Tags             *string `json:"tags"`
	Category         *int64  `json:"category"`
	ParentId         *int64  `json:"parent_id"`
	Accessibility    int     `json:"accessibility"`
	ContentMarkdown  *string `json:"content_markdown"`
	ContentHtml      *string `json:"content_html"`
	AuthorId         int64   `json:"author_id"`
	CreatedTimestamp int64   `json:"created_timestamp"`
	UpdatedTimestamp int64   `json:"updated_timestamp"`
}

func (m *Model) GetAllDocuments(authorId int64) ([]Document, error) {
	var documents []Document
	rows, err := m.DB.Query("SELECT id, name, description, tags, category, parent_id, accessibility, author_id, created_timestamp, updated_timestamp FROM documents WHERE author_id = ? ORDER BY name", authorId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var doc Document
		err := rows.Scan(
			&doc.Id, &doc.Name, &doc.Description, &doc.Tags, &doc.Category,
			&doc.ParentId, &doc.Accessibility, &doc.AuthorId, &doc.CreatedTimestamp, &doc.UpdatedTimestamp,
		)
		if err != nil {
			return nil, err
		}
		documents = append(documents, doc)
	}
	return documents, nil
}

func (m *Model) GetDocument(id, authorId int64) (*Document, error) {
	var doc Document
	err := m.DB.QueryRow("SELECT id, name, description, tags, category, parent_id, accessibility, author_id, created_timestamp, updated_timestamp FROM documents WHERE id = ? AND author_id = ?", id, authorId).Scan(
		&doc.Id, &doc.Name, &doc.Description, &doc.Tags, &doc.Category,
		&doc.ParentId, &doc.Accessibility, &doc.AuthorId, &doc.CreatedTimestamp, &doc.UpdatedTimestamp,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &doc, nil
}

func (m *Model) AddDocument(doc Document) error {
	_, err := m.DB.Exec(
		"INSERT INTO documents (id, name, description, tags, category, parent_id, accessibility, content_markdown, content_html, author_id, created_timestamp, updated_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		doc.Id, doc.Name, doc.Description, doc.Tags, doc.Category, doc.ParentId, doc.Accessibility, doc.ContentMarkdown, doc.ContentHtml, doc.AuthorId, doc.CreatedTimestamp, doc.UpdatedTimestamp,
	)
	return err
}

func (m *Model) UpdateDocument(id int64, doc Document) error {
	_, err := m.DB.Exec(
		"UPDATE documents SET name = ?, description = ?, tags = ?, category = ?, parent_id = ?, accessibility = ?, content_markdown = ?, content_html = ?, updated_timestamp = ? WHERE id = ?",
		doc.Name, doc.Description, doc.Tags, doc.Category, doc.ParentId, doc.Accessibility, doc.ContentMarkdown, doc.ContentHtml, doc.UpdatedTimestamp, id,
	)
	return err
}

func (m *Model) DeleteDocument(id int64) error {
	_, err := m.DB.Exec("DELETE FROM documents WHERE id = ?", id)
	return err
}
