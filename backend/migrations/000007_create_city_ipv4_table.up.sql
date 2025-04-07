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
)