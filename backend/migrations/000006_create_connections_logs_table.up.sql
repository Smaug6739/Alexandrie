CREATE TABLE IF NOT EXISTS `connections_logs` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `ip_adress` varchar(50) DEFAULT NULL,
  `user_agent` varchar(200) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `type` varchar(10) NOT NULL,
  `timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `connections_logs_users_id_fk` (`user_id`),
  CONSTRAINT `connections_logs_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
)