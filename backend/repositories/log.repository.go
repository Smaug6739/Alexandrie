package repositories

import (
	"errors"
	"math/big"
	"net"
	"strings"

	"github.com/jmoiron/sqlx"
)

type LogRepositoryImpl struct {
	db *sqlx.DB
}

type LogRepository interface {
	GetLocationFromIP(ip string) string
	getLocationIdFromIP(ip string) (int64, error)
}

func NewLogRepository(db *sqlx.DB) LogRepository {
	return &LogRepositoryImpl{db: db}
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
