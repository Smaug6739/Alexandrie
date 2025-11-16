-- Drop indexes to revert query performance optimization

-- Users table
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Nodes table
DROP INDEX IF EXISTS idx_nodes_user_id;
DROP INDEX IF EXISTS idx_nodes_parent_id;
DROP INDEX IF EXISTS idx_nodes_accessibility;
DROP INDEX IF EXISTS idx_nodes_created;
DROP INDEX IF EXISTS idx_nodes_updated;

-- Permissions table
DROP INDEX IF EXISTS idx_permissions_node_id;
DROP INDEX IF EXISTS idx_permissions_user_id;
DROP INDEX IF EXISTS idx_permissions_node_user;
