CREATE TABLE IF NOT EXISTS `ressources` (
  `id` varchar(50) NOT NULL,
  `filename` varchar(50) NOT NULL,
  `file_size` int NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `original_path` varchar(100) NOT NULL,
  `transformed_path` varchar(100) DEFAULT NULL,
  `author_id` varchar(50) NOT NULL,
  `created_timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ressources_users_id_fk` (`author_id`),
  CONSTRAINT `ressources_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
)