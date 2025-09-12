-- ========================================
-- 1. Création de la table nodes
-- ========================================
DROP TABLE IF EXISTS `nodes`;

CREATE TABLE `nodes` (
    `id` BIGINT UNSIGNED PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `role` TINYINT NOT NULL COMMENT '1=workspace, 2=category, 3=document, 4=ressource',
    `parent_id` BIGINT UNSIGNED NULL,
    `color` INT NULL,
    `icon` TEXT NULL,
    `created_timestamp` BIGINT NOT NULL,
    `updated_timestamp` BIGINT NOT NULL,
    CONSTRAINT `nodes_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `nodes_users_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 2. Création des nouvelles tables spécialisées
-- ========================================

DROP TABLE IF EXISTS `categories_new`;
CREATE TABLE `categories_new` (
    `node_id` BIGINT UNSIGNED PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `role` INT NOT NULL DEFAULT 1 COMMENT '1=category, 2=workspace',
		`order` INT DEFAULT NULL,
    CONSTRAINT `categories_nodes_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `documents_new`;
CREATE TABLE `documents_new` (
    `node_id` BIGINT UNSIGNED PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255),
    `tags` VARCHAR(200),
    `pinned` INT DEFAULT 0,
    `thumbnail` TEXT,
    `theme` VARCHAR(30),
		`accessibility` tinyint(1) NOT NULL,
    `content_markdown` LONGTEXT,
    `content_html` LONGTEXT,
    CONSTRAINT `documents_nodes_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ressources_new`;
CREATE TABLE `ressources_new` (
    `node_id` BIGINT UNSIGNED PRIMARY KEY,
    `filename` VARCHAR(50) NOT NULL,
    `file_size` INT NOT NULL,
    `file_type` VARCHAR(100) NOT NULL,
    `original_path` VARCHAR(100) NOT NULL,
    `transformed_path` VARCHAR(100),
    CONSTRAINT `ressources_nodes_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='For CDN';

-- ========================================
-- 3. Migration des catégories
-- ========================================

SET FOREIGN_KEY_CHECKS=0;


INSERT INTO nodes (id, user_id, role, parent_id, color, icon, created_timestamp, updated_timestamp)
SELECT 
    c.id,
    c.author_id,
    CASE WHEN c.role = 2 THEN 1 ELSE 2 END AS role,  -- workspace si role=2 sinon category
    c.parent_id,
    c.color,
    c.icon,
    UNIX_TIMESTAMP() * 1000,
    UNIX_TIMESTAMP() * 1000
FROM categories c;

INSERT INTO categories_new (node_id, name, role, `order`)
SELECT id, name, role, `order`
FROM categories;

-- ========================================
-- 4. Migration des documents
-- ========================================

INSERT INTO nodes (id, user_id, role, parent_id, color, icon, created_timestamp, updated_timestamp)
SELECT 
    d.id,
    d.author_id,
    3 AS role,
    COALESCE(d.parent_id, d.category),  -- parent doc si existe, sinon category
    d.color,
    d.icon,
    d.created_timestamp,
    d.updated_timestamp
FROM documents d;

INSERT INTO documents_new (node_id, name, description, tags, pinned, thumbnail, theme, accessibility, content_markdown, content_html)
SELECT 
    d.id, d.name, d.description, d.tags, d.pinned, d.thumbnail, d.theme, d.accessibility, d.content_markdown, d.content_html
FROM documents d;

-- ========================================
-- 5. Migration des ressources
-- ========================================

INSERT INTO nodes (id, user_id, role, parent_id, color, icon, created_timestamp, updated_timestamp)
SELECT 
    r.id,
    r.author_id,
    4 AS role,
    r.parent_id,
    NULL,
    NULL,
    r.created_timestamp,
    r.created_timestamp
FROM ressources r;

INSERT INTO ressources_new (node_id, filename, file_size, file_type, original_path, transformed_path)
SELECT r.id, r.filename, r.file_size, r.file_type, r.original_path, r.transformed_path
FROM ressources r;

SET FOREIGN_KEY_CHECKS=1;

-- ========================================
-- 6. Suppression des anciennes tables
-- ========================================

DROP TABLE IF EXISTS `ressources`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `categories`;

-- ========================================
-- 7. Renommage des nouvelles tables
-- ========================================

RENAME TABLE categories_new TO categories;
RENAME TABLE documents_new TO documents;
RENAME TABLE ressources_new TO ressources;

-- ========================================
-- FIN MIGRATION
-- ========================================
