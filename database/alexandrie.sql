-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: alexandrie
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `City_IPv4_complete`
--

DROP TABLE IF EXISTS `City_IPv4_complete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City_IPv4_complete` (
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
  CONSTRAINT `City_IPv4_complete_City_Locations_fr_geoname_id_fk` FOREIGN KEY (`geoname_id`) REFERENCES `City_Locations_fr` (`geoname_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `City_IPv6_complete`
--

DROP TABLE IF EXISTS `City_IPv6_complete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City_IPv6_complete` (
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
  CONSTRAINT `City_IPv6_complete_City_Locations_fr_geoname_id_fk` FOREIGN KEY (`geoname_id`) REFERENCES `City_Locations_fr` (`geoname_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `City_Locations_fr`
--

DROP TABLE IF EXISTS `City_Locations_fr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `City_Locations_fr` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon` text,
  `order` int DEFAULT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `author_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_categories_id_fk` (`parent_id`),
  KEY `categories_users_id_fk` (`author_id`),
  CONSTRAINT `categories_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `categories_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `connections_logs`
--

DROP TABLE IF EXISTS `connections_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `connections_logs` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ressources`
--

DROP TABLE IF EXISTS `ressources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ressources` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='For CDN';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(25) NOT NULL,
  `firstname` varchar(25) DEFAULT NULL,
  `lastname` varchar(25) DEFAULT NULL,
  `role` int default 1 NOT NULL,
  `avatar` varchar(75) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_timestamp` bigint NOT NULL,
  `updated_timestamp` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-29 13:28:38
