-- ========================================
-- Remove FULLTEXT indexes
-- ========================================

ALTER TABLE `nodes` DROP INDEX `ft_nodes_search`;
ALTER TABLE `nodes` DROP INDEX `ft_nodes_content`;
