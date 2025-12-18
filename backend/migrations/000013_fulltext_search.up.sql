-- ========================================
-- Add FULLTEXT index for content search
-- ========================================

-- Create FULLTEXT index on name, description, tags, and content
-- This allows efficient full-text search without using LIKE '%...%'
ALTER TABLE `nodes` 
ADD FULLTEXT INDEX `ft_nodes_search` (`name`, `description`, `tags`, `content`);

-- Also add a separate index for just the content (body) search
ALTER TABLE `nodes` 
ADD FULLTEXT INDEX `ft_nodes_content` (`content`);
