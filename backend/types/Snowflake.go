package types

import (
	"encoding/json"
	"strconv"
)

type Snowflake uint64

func (s Snowflake) MarshalJSON() ([]byte, error) {
	// Renvoie l'ID entre guillemets, pour JSON
	return json.Marshal(strconv.FormatUint(uint64(s), 10))
}
