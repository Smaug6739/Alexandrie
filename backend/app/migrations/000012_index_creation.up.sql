-- Create indexes to optimize query performance

-- Users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Nodes table
CREATE INDEX idx_nodes_user_id ON nodes(user_id);
CREATE INDEX idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX idx_nodes_accessibility ON nodes(accessibility);
CREATE INDEX idx_nodes_created ON nodes(created_timestamp);
CREATE INDEX idx_nodes_updated ON nodes(updated_timestamp);

-- Permissions table
CREATE INDEX idx_permissions_node_id ON permissions(node_id);
CREATE INDEX idx_permissions_user_id ON permissions(user_id);
CREATE INDEX idx_permissions_node_user ON permissions(node_id, user_id);
