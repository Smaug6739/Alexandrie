package models

type User struct {
	Id               int64   `json:"id"`
	Username         string  `json:"username"`
	Firstname        *string `json:"firstname"`
	Lastname         *string `json:"lastname"`
	Role             int     `json:"role"`
	Avatar           *string `json:"avatar"`
	Email            *string `json:"email"`
	Password         string  `json:"password,omitempty"`
	CreatedTimestamp *int64  `json:"created_timestamp"`
	UpdatedTimestamp *int64  `json:"updated_timestamp"`
}

func (m *Model) GetAllUsers() ([]User, error) {
	var users []User
	rows, err := m.DB.Query("SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users ORDER BY created_timestamp DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.Id, &user.Username, &user.Firstname, &user.Lastname,
			&user.Role, &user.Avatar, &user.Email, &user.CreatedTimestamp, &user.UpdatedTimestamp,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (m *Model) GetUser(id int64) (User, error) {
	var user User
	m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp FROM users WHERE id = ?", id).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.Password, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	return user, nil
}

func (m *Model) GetUserByUsername(username string) User {
	var user User
	m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp FROM users WHERE username = ?", username).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.Password, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	return user
}

func (m *Model) GetUserById(id int64) User {
	var user User
	m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users WHERE id = ?", id).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	return user
}
