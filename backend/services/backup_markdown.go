package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"archive/zip"
	"context"
	"fmt"
	"regexp"
	"strings"
)

// sanitizeFilename replaces invalid characters in the filename to ensure it's a valid path part
func sanitizeFilename(name string) string {
	// Replace \ / : * ? " < > | with _
	re := regexp.MustCompile(`[\\/:*?"<>|]`)
	sanitized := re.ReplaceAllString(name, "_")
	return strings.TrimSpace(sanitized)
}

// getNodeTreePath computes the full path for a node based on its parent hierarchy
func getNodeTreePath(node *models.Node, nodeMap map[types.Snowflake]*models.Node) string {
	pathParts := []string{sanitizeFilename(node.Name)}
	
	curr := node
	for curr.ParentId != nil {
		parent, ok := nodeMap[*curr.ParentId]
		if !ok {
			break // Broken link, stop
		}
		pathParts = append([]string{sanitizeFilename(parent.Name)}, pathParts...)
		curr = parent
	}
	
	return strings.Join(pathParts, "/")
}

func (s *backupService) processMarkdownBackup(
	ctx context.Context,
	job *types.BackupJob,
	zipWriter *zip.Writer,
	nodes []*models.Node,
	documents []*models.Node,
	nodeMap map[types.Snowflake]*models.Node,
	stats *types.BackupStats,
) error {
	// Process categories (folders)
	for _, node := range nodes {
		// Role 2 = Category (Folder), Role 3 = Board (also a container)
		if node.Role == 2 || node.Role == 3 {
			path := getNodeTreePath(node, nodeMap)
			// create zip folder entry (ends with /)
			_, err := zipWriter.Create(path + "/")
			if err != nil {
				// We can ignore error here as implicit directory creation is also fine
			}
		}
	}

	// Process documents
	for _, doc := range documents {
		path := getNodeTreePath(doc, nodeMap) + ".md"
		writer, err := zipWriter.Create(path)
		if err != nil {
			return fmt.Errorf("failed to create zip entry for %s: %v", path, err)
		}
		
		content := ""
		if doc.Content != nil {
			content = *doc.Content
		}
		
		_, err = writer.Write([]byte(content))
		if err != nil {
			return fmt.Errorf("failed to write content to %s: %v", path, err)
		}
	}

	return nil
}
