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
);

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
);

CREATE TABLE IF NOT EXISTS `documents` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `tags` varchar(200) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `accessibility` tinyint(1) NOT NULL,
  `content_markdown` longtext,
  `content_html` longtext,
  `author_id` varchar(50) NOT NULL,
  `created_timestamp` bigint NOT NULL,
  `updated_timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  KEY `category` (`category`),
  KEY `documents_ibfk_3` (`parent_id`),
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`category`) REFERENCES `categories` (`id`),
  CONSTRAINT `documents_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `documents_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
);

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS `city_ipv4_complete` (
  `network_start_integer` bigint DEFAULT NULL,
  `network_last_integer` bigint DEFAULT NULL,
  `geoname_id` int DEFAULT NULL,
  `registered_country_geoname_id` int DEFAULT NULL,
  `represented_country_geoname_id` text,
  `is_anonymous_proxy` int DEFAULT NULL,
  `is_satellite_provider` int DEFAULT NULL,
  `postal_code` text,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `accuracy_radius` int DEFAULT NULL,
  `is_anycast` text,
  KEY `City_IPv4_complete_City_Locations_fr_geoname_id_fk` (`geoname_id`),
  CONSTRAINT `City_IPv4_complete_City_Locations_fr_geoname_id_fk` FOREIGN KEY (`geoname_id`) REFERENCES `city_locations_fr` (`geoname_id`)
);

CREATE TABLE IF NOT EXISTS `city_ipv6_complete` (
  `network_start_integer` double DEFAULT NULL,
  `network_last_integer` double DEFAULT NULL,
  `geoname_id` int DEFAULT NULL,
  `registered_country_geoname_id` int DEFAULT NULL,
  `represented_country_geoname_id` text,
  `is_anonymous_proxy` int DEFAULT NULL,
  `is_satellite_provider` int DEFAULT NULL,
  `postal_code` text,
  `latitude` double DEFAULT NULL,
  `longitude` text,
  `accuracy_radius` text,
  `is_anycast` text,
  KEY `City_IPv6_complete_City_Locations_fr_geoname_id_fk` (`geoname_id`),
  CONSTRAINT `City_IPv6_complete_City_Locations_fr_geoname_id_fk` FOREIGN KEY (`geoname_id`) REFERENCES `city_locations_fr` (`geoname_id`)
);

CREATE TABLE IF NOT EXISTS `city_locations_fr` (
  `geoname_id` int NOT NULL,
  `locale_code` text,
  `continent_code` text,
  `continent_name` text,
  `country_iso_code` text,
  `country_name` text,
  `subdivision_1_iso_code` text,
  `subdivision_1_name` text,
  `subdivision_2_iso_code` text,
  `subdivision_2_name` text,
  `city_name` text,
  `metro_code` text,
  `time_zone` text,
  `is_in_european_union` text,
  PRIMARY KEY (`geoname_id`)
);