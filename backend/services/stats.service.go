package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"time"
)

type StatsService interface {
	GetOverviewStats() (*models.OverviewStats, error)
	GetUserStats() (*models.UserStats, error)
	GetNodeStats(topLimit int) (*models.NodeStats, error)
}

type statsService struct {
	statsRepo repositories.StatsRepository
}

func NewStatsService(statsRepo repositories.StatsRepository) StatsService {
	return &statsService{statsRepo: statsRepo}
}

func (s *statsService) GetOverviewStats() (*models.OverviewStats, error) {
	totalUsers, err := s.statsRepo.GetUsersTotal()
	if err != nil {
		return nil, err
	}

	totalNodes, err := s.statsRepo.GetNodesTotal()
	if err != nil {
		return nil, err
	}

	totalSize, err := s.statsRepo.GetNodesTotalSize()
	if err != nil {
		return nil, err
	}

	return &models.OverviewStats{
		TotalUsers: totalUsers,
		TotalNodes: totalNodes,
		TotalSize:  totalSize,
	}, nil
}

func (s *statsService) GetUserStats() (*models.UserStats, error) {
	totalUsers, err := s.statsRepo.GetUsersTotal()
	if err != nil {
		return nil, err
	}

	since := startOfMonthUTC(time.Now().UTC()).AddDate(0, -11, 0).UnixMilli()
	monthlyGrowth, err := s.statsRepo.GetUsersMonthlyGrowth(since)
	if err != nil {
		return nil, err
	}

	return &models.UserStats{
		TotalUsers:         totalUsers,
		GrowthLast12Months: fillMissingMonths(monthlyGrowth, 12),
	}, nil
}

func (s *statsService) GetNodeStats(topLimit int) (*models.NodeStats, error) {
	totalNodes, err := s.statsRepo.GetNodesTotal()
	if err != nil {
		return nil, err
	}

	totalSize, err := s.statsRepo.GetNodesTotalSize()
	if err != nil {
		return nil, err
	}

	since := startOfMonthUTC(time.Now().UTC()).AddDate(0, -11, 0).UnixMilli()
	monthlyGrowth, err := s.statsRepo.GetNodesMonthlyGrowth(since)
	if err != nil {
		return nil, err
	}

	topByNodes, err := s.statsRepo.GetTopUsersByNodeCount(topLimit)
	if err != nil {
		return nil, err
	}

	topBySize, err := s.statsRepo.GetTopUsersByNodeSize(topLimit)
	if err != nil {
		return nil, err
	}

	return &models.NodeStats{
		TotalNodes:         totalNodes,
		TotalSize:          totalSize,
		GrowthLast12Months: fillMissingMonths(monthlyGrowth, 12),
		TopUsersByNodes:    topByNodes,
		TopUsersBySize:     topBySize,
	}, nil
}

func fillMissingMonths(series []models.MonthlyCount, months int) []models.MonthlyCount {
	if months <= 0 {
		return []models.MonthlyCount{}
	}

	lookup := make(map[string]int64, len(series))
	for _, row := range series {
		lookup[row.Month] = row.Count
	}

	now := startOfMonthUTC(time.Now().UTC())
	result := make([]models.MonthlyCount, 0, months)
	for i := months - 1; i >= 0; i-- {
		month := now.AddDate(0, -i, 0).Format("2006-01")
		result = append(result, models.MonthlyCount{
			Month: month,
			Count: lookup[month],
		})
	}

	return result
}

func startOfMonthUTC(t time.Time) time.Time {
	utc := t.UTC()
	return time.Date(utc.Year(), utc.Month(), 1, 0, 0, 0, 0, time.UTC)
}
