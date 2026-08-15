ALTER TABLE users ADD COLUMN totp_forced BOOLEAN DEFAULT FALSE AFTER totp_enabled;
ALTER TABLE users ADD COLUMN `type` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0: Regular user, 1: Supervised account' AFTER `role`;
