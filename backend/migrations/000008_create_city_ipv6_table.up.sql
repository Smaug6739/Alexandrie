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
)