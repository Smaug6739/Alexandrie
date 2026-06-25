CREATE TABLE IF NOT EXISTS `permissions_invitations` (
		`id` BIGINT UNSIGNED NOT NULL,
		`invitation_code` VARCHAR(6) NOT NULL, -- 6 digit invitation code
		`permission_level` TINYINT UNSIGNED NOT NULL, -- Permission level (1: read, 2: write, 3: admin)
		`node_id` BIGINT UNSIGNED NOT NULL, -- Node ID associated with the invitation
		`created_timestamp` BIGINT UNSIGNED NOT NULL,
		PRIMARY KEY (`id`),
		UNIQUE KEY `uk_invitation_code` (`invitation_code`),
		KEY `idx_node_id` (`node_id`),
		CONSTRAINT `fk_node` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;