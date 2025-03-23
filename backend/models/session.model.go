package models

type Session struct {
	Id                   int64  `json:"id"`
	UserId               int64  `json:"user_id"`
	RefreshToken         string `json:"refresh_token"`
	ExpireToken          int64  `json:"expire_token"`
	LastRefreshTimestamp int64  `json:"last_refresh_timestamp"`
	Active               int    `json:"active"` // 0: No; 1: Yes;
	LoginTimestamp       int64  `json:"login_timestamp"`
	LogoutTimestamp      int64  `json:"logout_timestamp"`
}

func (m *Model) CreateSession(session *Session) (*Session, error) {
	_, err := m.DB.Exec("INSERT INTO sessions (id, user_id, refresh_token, expire_token, last_refresh_timestamp, active, login_timestamp, logout_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		session.Id, session.UserId, session.RefreshToken, session.ExpireToken, session.LastRefreshTimestamp, session.Active, session.LoginTimestamp, session.LogoutTimestamp)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (m *Model) GetSession(refreshToken string) (Session, error) {
	var session Session
	m.DB.QueryRow("SELECT * FROM sessions WHERE refresh_token = ?", refreshToken).Scan(
		&session.Id, &session.UserId, &session.RefreshToken, &session.ExpireToken, &session.LastRefreshTimestamp, &session.Active, &session.LoginTimestamp, &session.LogoutTimestamp,
	)
	return session, nil
}

func (m *Model) UpdateSession(session *Session) (*Session, error) {
	_, err := m.DB.Exec("UPDATE sessions SET refresh_token = ?, expire_token = ?, last_refresh_timestamp = ?, active = ?, login_timestamp = ?, logout_timestamp = ? WHERE id = ?",
		session.RefreshToken, session.ExpireToken, session.LastRefreshTimestamp, session.Active, session.LoginTimestamp, session.LogoutTimestamp, session.Id)
	if err != nil {
		return nil, err
	}
	return session, nil
}
