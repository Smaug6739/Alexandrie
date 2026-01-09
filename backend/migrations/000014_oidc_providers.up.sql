CREATE TABLE IF NOT EXISTS `user_oidc_providers` (
    `id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `provider_name` VARCHAR(50) NOT NULL,
    `provider_user_id` VARCHAR(255) NOT NULL,
    `created_timestamp` BIGINT UNSIGNED NOT NULL,
    `updated_timestamp` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_provider_user` (`provider_name`, `provider_user_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_provider_name` (`provider_name`),
    CONSTRAINT `fk_oidc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
