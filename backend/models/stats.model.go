package models

import "alexandrie/types"

type MonthlyCount struct {
	Month string `json:"month" db:"month"`
	Count int64  `json:"count" db:"count"`
}

type UserStats struct {
	TotalUsers         int64          `json:"total_users"`
	GrowthLast12Months []MonthlyCount `json:"growth_last_12_months"`
}

type NodeOwnerStats struct {
	UserID    types.Snowflake `json:"user_id" db:"user_id"`
	Username  string          `json:"username" db:"username"`
	NodeCount int64           `json:"node_count" db:"node_count"`
	TotalSize int64           `json:"total_size" db:"total_size"`
}

type NodeStats struct {
	TotalNodes         int64            `json:"total_nodes"`
	TotalSize          int64            `json:"total_size"`
	GrowthLast12Months []MonthlyCount   `json:"growth_last_12_months"`
	TopUsersByNodes    []NodeOwnerStats `json:"top_users_by_nodes"`
	TopUsersBySize     []NodeOwnerStats `json:"top_users_by_size"`
}

type OverviewStats struct {
	TotalUsers int64 `json:"total_users"`
	TotalNodes int64 `json:"total_nodes"`
	TotalSize  int64 `json:"total_size"`
}
