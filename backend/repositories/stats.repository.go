package repositories

import (
	"alexandrie/models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type StatsRepository interface {
	GetUsersTotal() (int64, error)
	GetUsersMonthlyGrowth(sinceTimestamp int64) ([]models.MonthlyCount, error)
	GetNodesTotal() (int64, error)
	GetNodesTotalSize() (int64, error)
	GetNodesMonthlyGrowth(sinceTimestamp int64) ([]models.MonthlyCount, error)
	GetTopUsersByNodeCount(limit int) ([]models.NodeOwnerStats, error)
	GetTopUsersByNodeSize(limit int) ([]models.NodeOwnerStats, error)
}

type StatsRepositoryImpl struct {
	db *sqlx.DB
}

func NewStatsRepository(db *sqlx.DB) StatsRepository {
	return &StatsRepositoryImpl{db: db}
}

func (r *StatsRepositoryImpl) GetUsersTotal() (int64, error) {
	var total int64
	if err := r.db.Get(&total, `SELECT COUNT(*) FROM users`); err != nil {
		return 0, fmt.Errorf("failed to count users: %w", err)
	}
	return total, nil
}

func (r *StatsRepositoryImpl) GetUsersMonthlyGrowth(sinceTimestamp int64) ([]models.MonthlyCount, error) {
	rows := []models.MonthlyCount{}
	err := r.db.Select(&rows, `
		SELECT
			DATE_FORMAT(FROM_UNIXTIME(created_timestamp / 1000), '%Y-%m') AS month,
			COUNT(*) AS count
		FROM users
		WHERE created_timestamp >= ?
		GROUP BY month
		ORDER BY month ASC`, sinceTimestamp)
	if err != nil {
		return nil, fmt.Errorf("failed to aggregate users monthly growth: %w", err)
	}
	return rows, nil
}

func (r *StatsRepositoryImpl) GetNodesTotal() (int64, error) {
	var total int64
	if err := r.db.Get(&total, `SELECT COUNT(*) FROM nodes`); err != nil {
		return 0, fmt.Errorf("failed to count nodes: %w", err)
	}
	return total, nil
}

func (r *StatsRepositoryImpl) GetNodesTotalSize() (int64, error) {
	var totalSize int64
	if err := r.db.Get(&totalSize, `SELECT COALESCE(SUM(size), 0) FROM nodes`); err != nil {
		return 0, fmt.Errorf("failed to sum nodes size: %w", err)
	}
	return totalSize, nil
}

func (r *StatsRepositoryImpl) GetNodesMonthlyGrowth(sinceTimestamp int64) ([]models.MonthlyCount, error) {
	rows := []models.MonthlyCount{}
	err := r.db.Select(&rows, `
		SELECT
			DATE_FORMAT(FROM_UNIXTIME(created_timestamp / 1000), '%Y-%m') AS month,
			COUNT(*) AS count
		FROM nodes
		WHERE created_timestamp >= ?
		GROUP BY month
		ORDER BY month ASC`, sinceTimestamp)
	if err != nil {
		return nil, fmt.Errorf("failed to aggregate nodes monthly growth: %w", err)
	}
	return rows, nil
}

func (r *StatsRepositoryImpl) GetTopUsersByNodeCount(limit int) ([]models.NodeOwnerStats, error) {
	if limit <= 0 {
		limit = 5
	}

	rows := []models.NodeOwnerStats{}
	err := r.db.Select(&rows, `
		SELECT
			n.user_id AS user_id,
			u.username AS username,
			COUNT(n.id) AS node_count,
			COALESCE(SUM(n.size), 0) AS total_size
		FROM nodes n
		JOIN users u ON u.id = n.user_id
		GROUP BY n.user_id, u.username
		ORDER BY node_count DESC, total_size DESC
		LIMIT ?`, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get top users by node count: %w", err)
	}

	return rows, nil
}

func (r *StatsRepositoryImpl) GetTopUsersByNodeSize(limit int) ([]models.NodeOwnerStats, error) {
	if limit <= 0 {
		limit = 5
	}

	rows := []models.NodeOwnerStats{}
	err := r.db.Select(&rows, `
		SELECT
			n.user_id AS user_id,
			u.username AS username,
			COUNT(n.id) AS node_count,
			COALESCE(SUM(n.size), 0) AS total_size
		FROM nodes n
		JOIN users u ON u.id = n.user_id
		GROUP BY n.user_id, u.username
		ORDER BY total_size DESC, node_count DESC
		LIMIT ?`, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get top users by node size: %w", err)
	}

	return rows, nil
}
