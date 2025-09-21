-- ========================================
-- 1. Create new nodes table
-- ========================================
DROP TABLE IF EXISTS `nodes`;

CREATE TABLE `nodes` (
    `id` BIGINT UNSIGNED PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `parent_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `tags` VARCHAR(200) NULL,
    `role` TINYINT NOT NULL COMMENT '1=workspace, 2=category, 3=document, 4=ressource',
    `color` INT NULL,
    `icon` TEXT NULL,
    `thumbnail` TEXT NULL,
    `theme` VARCHAR(30) NULL,
    `accessibility` tinyint(1) NULL,
    `access` INT NOT NULL DEFAULT 0,
    `display` TINYINT NULL,
    `order` INT NULL,
    `content` LONGTEXT NULL,
    `content_compiled` LONGTEXT NULL,
    `size` INT NULL,
    `metadata` JSON NULL,
    `created_timestamp` BIGINT NOT NULL,
    `updated_timestamp` BIGINT NOT NULL,
    CONSTRAINT `nodes_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `nodes_users_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_parent_not_self` CHECK (`parent_id` IS NULL OR `parent_id` != `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SET FOREIGN_KEY_CHECKS=0;

-- ========================================
-- 2. Migrate categories
-- ========================================

INSERT INTO nodes (`id`, `user_id`, `parent_id`,  `name`, `role`, `color`, `icon`, `order`, `created_timestamp`, `updated_timestamp`)
SELECT 
    c.id,
    c.author_id,
    c.parent_id,
    c.name,
    CASE WHEN CAST(c.role AS UNSIGNED) = 2 THEN 1 ELSE 2 END AS role,  -- workspace si role=2 sinon category
    c.color,
    c.icon,
    c.order,
    UNIX_TIMESTAMP() * 1000,
    UNIX_TIMESTAMP() * 1000
FROM categories c;


-- ========================================
-- 3. Migrate documents
-- ========================================

INSERT INTO nodes (`id`, `user_id`, `parent_id`,  `name`, `description`, `tags`, `role`, `color`, `icon`, `thumbnail`, `theme`, `accessibility`, `content`, `content_compiled`, `created_timestamp`, `updated_timestamp`)
SELECT 
    d.id,
    d.author_id,
    COALESCE(d.parent_id, d.category),
    d.name,
    d.description,
    d.tags,
    3 AS role,  -- document role is always 3
    d.color,
    d.icon,
    d.thumbnail,
    d.theme,
    d.accessibility,
    d.content_markdown,
    d.content_html,
    d.created_timestamp,
    d.updated_timestamp
FROM documents d;


-- ========================================
-- 4. Migrate ressources
-- ========================================

INSERT INTO nodes (`id`, `user_id`, `parent_id`,  `name`, `role`, `size`, `content`, `content_compiled`, `metadata`, `created_timestamp`, `updated_timestamp`)
SELECT 
    r.id,
    r.author_id,
    r.parent_id,
    r.filename,
    4 AS role,
    r.file_size,
    r.original_path,
    r.transformed_path,
    JSON_OBJECT(
        'filetype', r.file_type
    ),
    r.created_timestamp,
    r.created_timestamp
FROM ressources r;

SET FOREIGN_KEY_CHECKS=1;

-- ========================================
-- 5. Delete old tables
-- ========================================

DROP TABLE IF EXISTS `ressources`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `categories`;