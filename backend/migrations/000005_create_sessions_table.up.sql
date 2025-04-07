CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `expire_token` bigint DEFAULT NULL,
  `last_refresh_timestamp` bigint DEFAULT NULL,
  `active` int DEFAULT NULL,
  `login_timestamp` bigint DEFAULT NULL,
  `logout_timestamp` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_auth_users_id_fk` (`user_id`)
)