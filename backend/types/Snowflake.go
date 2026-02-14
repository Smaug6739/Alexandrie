package types

import (
	"encoding/json"
	"strconv"
	"strings"
)

type Snowflake uint64

// Convert string to Snowflake
func SnowflakeFromString(s string) (*Snowflake, error) {
	val, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return nil, err
	}
	sf := Snowflake(val)
	return &sf, nil
}

func (s Snowflake) MarshalJSON() ([]byte, error) {
	// Renvoie l'ID entre guillemets, pour JSON
	return json.Marshal(strconv.FormatUint(uint64(s), 10))
}

// UnmarshalJSON : décode un string JSON en Snowflake
func (s *Snowflake) UnmarshalJSON(b []byte) error {
	str := strings.Trim(string(b), `"`)
	val, err := strconv.ParseUint(str, 10, 64)
	if err != nil {
		return err
	}
	*s = Snowflake(val)
	return nil
}

// String returns the string representation of the Snowflake
func (s Snowflake) String() string {
	return strconv.FormatUint(uint64(s), 10)
}
