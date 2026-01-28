-- Drop FOREIGN KEY constraints and indexes before changing the column type
-- and then re-add them after the change

ALTER TABLE categories
    DROP FOREIGN KEY categories_categories_id_fk,
    DROP FOREIGN KEY categories_users_id_fk;

ALTER TABLE connections_logs
    DROP FOREIGN KEY connections_logs_users_id_fk;

ALTER TABLE documents
    DROP FOREIGN KEY documents_ibfk_2,
    DROP FOREIGN KEY documents_ibfk_3,
    DROP FOREIGN KEY documents_users_id_fk;

ALTER TABLE ressources
    DROP FOREIGN KEY ressources_users_id_fk;

-- Change the column type from varchar(50) to bigint(20) unsigned
ALTER TABLE categories
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN parent_id parent_id BIGINT(20) UNSIGNED DEFAULT NULL,
		CHANGE COLUMN author_id author_id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN workspace_id workspace_id BIGINT(20) UNSIGNED DEFAULT '1';

ALTER TABLE connections_logs
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN user_id user_id BIGINT(20) UNSIGNED NOT NULL;

ALTER TABLE documents
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN category category BIGINT(20) UNSIGNED DEFAULT NULL,
		CHANGE COLUMN parent_id parent_id BIGINT(20) UNSIGNED DEFAULT NULL,
		CHANGE COLUMN author_id author_id BIGINT(20) UNSIGNED NOT NULL;

ALTER TABLE ressources
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN author_id author_id BIGINT(20) UNSIGNED NOT NULL;

ALTER TABLE `sessions`
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL,
		CHANGE COLUMN user_id user_id BIGINT(20) UNSIGNED NOT NULL;

ALTER TABLE users
		CHANGE COLUMN id id BIGINT(20) UNSIGNED NOT NULL;

-- Re-add the foreign key constraints and indexes, add also on delete cascade

ALTER TABLE categories
		ADD CONSTRAINT categories_categories_id_fk FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE CASCADE,
		ADD CONSTRAINT categories_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE connections_logs
		ADD CONSTRAINT connections_logs_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE documents
		ADD CONSTRAINT documents_category_ib_fk FOREIGN KEY (category) REFERENCES categories (id) ON DELETE CASCADE,
		ADD CONSTRAINT documents_parent_ib_fk FOREIGN KEY (parent_id) REFERENCES documents (id) ON DELETE CASCADE,
		ADD CONSTRAINT documents_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE ressources
		ADD CONSTRAINT ressources_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE `sessions`
		ADD CONSTRAINT users_auth_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;