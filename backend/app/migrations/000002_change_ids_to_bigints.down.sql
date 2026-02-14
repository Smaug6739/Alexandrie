-- Drop foreign keys added in the UP migration
ALTER TABLE categories
    DROP FOREIGN KEY categories_categories_id_fk,
    DROP FOREIGN KEY categories_users_id_fk;

ALTER TABLE connections_logs
    DROP FOREIGN KEY connections_logs_users_id_fk;

ALTER TABLE documents
    DROP FOREIGN KEY documents_category_ib_fk,
    DROP FOREIGN KEY documents_parent_ib_fk,
    DROP FOREIGN KEY documents_users_id_fk;

ALTER TABLE ressources
    DROP FOREIGN KEY ressources_users_id_fk;

ALTER TABLE sessions
    DROP FOREIGN KEY users_auth_users_id_fk;

-- Revert columns to VARCHAR(50) or previous types
ALTER TABLE categories
    CHANGE COLUMN id id VARCHAR(50) NOT NULL,
    CHANGE COLUMN parent_id parent_id VARCHAR(50) DEFAULT NULL,
    CHANGE COLUMN author_id author_id VARCHAR(50) NOT NULL,
    CHANGE COLUMN workspace_id workspace_id VARCHAR(50) DEFAULT '1';

ALTER TABLE connections_logs
    CHANGE COLUMN user_id user_id VARCHAR(50) NOT NULL,
    CHANGE COLUMN document_id document_id VARCHAR(50) DEFAULT NULL;

ALTER TABLE documents
    CHANGE COLUMN id id VARCHAR(50) NOT NULL,
    CHANGE COLUMN category category VARCHAR(50) DEFAULT NULL,
    CHANGE COLUMN parent_id parent_id VARCHAR(50) DEFAULT NULL,
    CHANGE COLUMN author_id author_id VARCHAR(50) NOT NULL;

ALTER TABLE ressources
    CHANGE COLUMN id id VARCHAR(50) NOT NULL,
    CHANGE COLUMN author_id author_id VARCHAR(50) NOT NULL;

ALTER TABLE sessions
    CHANGE COLUMN id id VARCHAR(50) NOT NULL,
    CHANGE COLUMN user_id user_id VARCHAR(50) NOT NULL;

ALTER TABLE users
    CHANGE COLUMN id id VARCHAR(50) NOT NULL;

-- Re-add original foreign key constraints (without cascade if that was the case)
ALTER TABLE categories
    ADD CONSTRAINT categories_categories_id_fk FOREIGN KEY (parent_id) REFERENCES categories (id),
    ADD CONSTRAINT categories_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id);

ALTER TABLE connections_logs
    ADD CONSTRAINT connections_logs_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE documents
    ADD CONSTRAINT documents_ibfk_2 FOREIGN KEY (category) REFERENCES categories (id),
    ADD CONSTRAINT documents_ibfk_3 FOREIGN KEY (parent_id) REFERENCES documents (id),
    ADD CONSTRAINT documents_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id);

ALTER TABLE ressources
    ADD CONSTRAINT ressources_users_id_fk FOREIGN KEY (author_id) REFERENCES users (id);

ALTER TABLE sessions
    ADD CONSTRAINT users_auth_users_id_fk FOREIGN KEY (user_id) REFERENCES users (id);
