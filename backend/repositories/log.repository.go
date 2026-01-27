package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"errors"
	"fmt"
	"math/big"
	"net"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

type LogRepositoryImpl struct {
	db *sqlx.DB
}

type LogRepository interface {
	GetByUserID(userId types.Snowflake) ([]*models.Log, error)
	GetLastByUserID(userId types.Snowflake) (*models.Log, error)
	Create(log *models.Log) error
	DeleteOld() error
	GetLocationFromIP(ip string) string
	getLocationIdFromIP(ip string) (int64, error)
}

func NewLogRepository(db *sqlx.DB) LogRepository {
	return &LogRepositoryImpl{db: db}
}

// GetByUserID retrieves all logs for a user
func (r *LogRepositoryImpl) GetByUserID(userId types.Snowflake) ([]*models.Log, error) {
	var logs []*models.Log
	err := r.db.Select(&logs, `
		SELECT id, user_id, ip_adress, timestamp, type, location, user_agent
		FROM connections_logs
		WHERE user_id = ?
		ORDER BY timestamp DESC`, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to query logs: %w", err)
	}
	return logs, nil
}

// GetLastByUserID retrieves the last login connection for a user
func (r *LogRepositoryImpl) GetLastByUserID(userId types.Snowflake) (*models.Log, error) {
	var log models.Log
	err := r.db.Get(&log, `
		SELECT id, user_id, ip_adress, timestamp, type, location, user_agent
		FROM connections_logs
		WHERE user_id = ?
		ORDER BY timestamp DESC
		LIMIT 1`, userId)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get last connection: %w", err)
	}
	return &log, nil
}

// Create creates a new connection log
func (r *LogRepositoryImpl) Create(log *models.Log) error {
	_, err := r.db.Exec(`
		INSERT INTO connections_logs (id, user_id, ip_adress, timestamp, type, location, user_agent)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		log.Id, log.UserId, log.IpAddr, log.Timestamp, log.Type, log.Location, log.UserAgent)
	if err != nil {
		return fmt.Errorf("failed to create connection log: %w", err)
	}
	return nil
}

// DeleteOld deletes logs older than 90 days
func (r *LogRepositoryImpl) DeleteOld() error {
	ninetyDaysAgo := time.Now().AddDate(0, 0, -90).UnixMilli()
	_, err := r.db.Exec(`DELETE FROM connections_logs WHERE timestamp < ?`, ninetyDaysAgo)
	if err != nil {
		return fmt.Errorf("failed to delete old logs: %w", err)
	}
	return nil
}

// GetLocationFromIP returns the location string from an IP address
func (r *LogRepositoryImpl) GetLocationFromIP(ip string) string {
	geonameId, err := r.getLocationIdFromIP(ip)
	if err != nil {
		return "Unknown location"
	}
	var res [4]*string
	err = r.db.QueryRow(`
		SELECT city_name, subdivision_1_name, subdivision_2_name, country_name 
		FROM city_locations_fr 
		WHERE geoname_id = ? 
		LIMIT 1`, geonameId).Scan(&res[0], &res[1], &res[2], &res[3])
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

// getLocationIdFromIP returns the geoname ID for an IP address
func (r *LogRepositoryImpl) getLocationIdFromIP(ip string) (int64, error) {
	ipInt, db, err := ipToDecimal(ip)
	if err != nil {
		return 0, err
	}
	var locationId int64

	var query string
	switch db {
	case "ipv4":
		query = `SELECT geoname_id FROM city_ipv4_complete WHERE ? BETWEEN network_start_integer AND network_last_integer LIMIT 1`
	case "ipv6":
		query = `SELECT geoname_id FROM city_ipv6_complete WHERE ? BETWEEN network_start_integer AND network_last_integer LIMIT 1`
	default:
		return 0, errors.New("unsupported IP address type")
	}

	err = r.db.QueryRow(query, ipInt).Scan(&locationId)
	if err != nil {
		return 0, err
	}

	return locationId, nil
}

// ipToDecimal converts an IP address to its decimal representation
func ipToDecimal(ipStr string) (string, string, error) {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return "", "", errors.New("invalid IP adress")
	}
	if ip4 := ip.To4(); ip4 != nil {
		return big.NewInt(0).SetBytes(ip4).String(), "ipv4", nil
	}
	ip = ip.To16()
	if ip == nil {
		return "", "", errors.New("invalid or unsupported IP address")
	}
	return big.NewInt(0).SetBytes(ip).String(), "ipv6", nil
}
