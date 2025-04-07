CREATE TABLE IF NOT EXISTS `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon` text,
  `order` int DEFAULT NULL,
  `role` int NOT NULL DEFAULT '1' COMMENT '1 = category; 2 = workspace',
  `workspace_id` varchar(50) DEFAULT '1',
  `parent_id` varchar(50) DEFAULT NULL,
  `author_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_categories_id_fk` (`parent_id`),
  KEY `categories_users_id_fk` (`author_id`),
  CONSTRAINT `categories_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `categories_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
)