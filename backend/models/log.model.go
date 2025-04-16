package models

type Log struct {
	Id        uint64 `json:"id"`
	UserId    uint64 `json:"user_id"`
	IpAddr    string `json:"ip_address"`
	UserAgent string `json:"user_agent"`
	Location  string `json:"location"`
	Type      string `json:"type"`
	Timestamp int64  `json:"timestamp"`
}
