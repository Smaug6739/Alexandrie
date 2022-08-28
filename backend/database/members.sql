CREATE TABLE IF NOT EXISTS `members` (
  `id` varchar(50) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `permissions` int DEFAULT NULL,
  `banishment` bigint DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `age` varchar(45) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `date_insert` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
