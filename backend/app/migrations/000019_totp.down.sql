ALTER TABLE users DROP COLUMN totp_secret;
ALTER TABLE users DROP COLUMN totp_enabled;

DROP TABLE IF EXISTS user_totp_recovery_codes;