CREATE TABLE `calendar_events` (
    `id` BIGINT UNSIGNED PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `start_date` BIGINT NOT NULL COMMENT 'Start timestamp',
    `end_date` BIGINT NOT NULL COMMENT 'End timestamp',
    `color` VARCHAR(50) NULL COMMENT 'hex or theme colors name',
    `type` VARCHAR(50) NOT NULL DEFAULT 'event' COMMENT 'event, homework, exam and all others kind of stuffs',
    `node_id` BIGINT UNSIGNED NULL COMMENT 'Linked document/node ID',
    `created_timestamp` BIGINT NOT NULL,
    `updated_timestamp` BIGINT NOT NULL,
    CONSTRAINT `calendar_events_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `calendar_events_node_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
