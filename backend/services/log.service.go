package services

import (
	"Smaug6739/Alexandrie/models"
	"database/sql"
	"errors"
	"fmt"
	"math/big"
	"net"
	"strings"
	"time"
)

type LogService interface {
	GetConnections(userId int64) ([]*models.Log, error)
	GetLastConnection(userId int64) (*models.Log, error)
	GetLocationFromIp(ip string) string
	CreateConnectionLog(log *models.Log) (*models.Log, error)
	DeleteOldLogs() error

	getLocationIdFromIp(ip string) (int64, error)
}

func NewLogService(db *sql.DB) LogService {
	return &Service{db: db}
}

func (s *Service) GetConnections(userId int64) ([]*models.Log, error) {
	var logs []*models.Log
	rows, err := s.db.Query("SELECT * FROM connections_logs WHERE user_id = ?", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var log models.Log
		if err := rows.Scan(&log.Id, &log.IpAddr, &log.Location, &log.Timestamp, &log.Type, &log.UserAgent, &log.UserId); err != nil {
			return nil, err
		}
		logs = append(logs, &log)
	}
	return logs, nil
}

func (s *Service) GetLastConnection(userId int64) (*models.Log, error) {
	var log models.Log
	err := s.db.QueryRow("SELECT * FROM connections_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1", userId).Scan(&log.Id, &log.IpAddr, &log.Location, &log.Timestamp, &log.Type, &log.UserAgent, &log.UserId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No rows found
		}
		return nil, err
	}
	return &log, nil
}

func (s *Service) CreateConnectionLog(log *models.Log) (*models.Log, error) {
	_, err := s.db.Exec("INSERT INTO connections_logs (id, user_id, ip_adress, user_agent, location, type, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
		log.Id, log.UserId, log.IpAddr, log.UserAgent, log.Location, log.Type, log.Timestamp)
	if err != nil {
		return nil, err
	}
	return log, nil
}

func (s *Service) DeleteOldLogs() error {
	// Delete logs older than 50 days
	_, err := s.db.Exec("DELETE FROM connections_logs WHERE timestamp < ?", time.Now().Add(-50*24*time.Hour).UnixMilli())
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) GetLocationFromIp(ip string) string {
	geonameId, err := s.getLocationIdFromIp(ip)
	if err != nil {
		return "Unknown location"
	}
	var res [4]*string
	err = s.db.QueryRow("SELECT city_name, subdivision_1_name, subdivision_2_name, country_name FROM city_Locations_fr WHERE geoname_id = ? LIMIT 1", geonameId).Scan(&res[0], &res[1], &res[2], &res[3])
	if err != nil {
		return "Unknown location"
	}
	parts := []string{}
	for _, part := range res {
		if part != nil && *part != "" {
			parts = append(parts, *part)
		}
	}
	return strings.Join(parts, ", ")
}

func (s *Service) getLocationIdFromIp(ip string) (int64, error) {
	ipInt, db, err := ipToDecimal(ip)
	if err != nil {
		return 0, err
	}
	var locationId int64
	err = s.db.QueryRow(fmt.Sprintf("SELECT geoname_id FROM %s WHERE ? BETWEEN network_start_integer AND network_last_integer LIMIT 1", db), ipInt).Scan(&locationId)
	if err != nil {
		return 0, err
	}
	return locationId, nil
}

func ipToDecimal(ipStr string) (string, string, error) {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return "", "", errors.New("invalid IP adress")
	}
	if ip4 := ip.To4(); ip4 != nil {
		return big.NewInt(0).SetBytes(ip4).String(), "city_ipv4_complete", nil
	}
	ip = ip.To16()
	if ip == nil {
		return "", "", errors.New("invalid or unsupported IP address")
	}
	return big.NewInt(0).SetBytes(ip).String(), "city_ipv6_complete", nil
}
