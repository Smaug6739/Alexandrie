CREATE TABLE IF NOT EXISTS `articles` (
  `id` varchar(50) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `path` varchar(50) DEFAULT NULL,
  `main_category` varchar(50) DEFAULT NULL,
  `sub_category` varchar(50) DEFAULT NULL,
  `content_html` longtext,
  `content_markdown` text,
  `created_timestamp` varchar(50) DEFAULT NULL,
  `updated_timestamp` varchar(50) DEFAULT NULL,
  `author_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


