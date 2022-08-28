
CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `path` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `parent_category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
