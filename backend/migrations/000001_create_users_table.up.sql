CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(25) NOT NULL,
  `firstname` varchar(25) DEFAULT NULL,
  `lastname` varchar(25) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '1',
  `avatar` varchar(75) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_timestamp` bigint NOT NULL,
  `updated_timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`)
)
