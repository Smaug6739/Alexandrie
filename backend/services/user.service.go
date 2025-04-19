package services

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(id types.Snowflake) (*models.User, error)
	GetUserByUsername(username string) (*models.User, error)
	CheckUsernameExists(username string) bool
	CreateUser(user *models.User) (*models.User, error)
	UpdateUser(id types.Snowflake, user *models.User) (*models.User, error)
	UpdatePassword(id types.Snowflake, password string) error
	DeleteUser(id types.Snowflake) error
}

func NewUserService(db *sql.DB) UserService {
	return &Service{db: db}
}

func (s *Service) GetAllUsers() ([]*models.User, error) {
	var users []*models.User
	rows, err := s.db.Query("SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.Id, &user.Username, &user.Firstname, &user.Lastname,
			&user.Role, &user.Avatar, &user.Email, &user.CreatedTimestamp, &user.UpdatedTimestamp); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	return users, nil
}

func (m *Service) CheckUsernameExists(username string) bool {
	var count int
	err := m.db.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", username).Scan(&count)
	if err != nil {
		return false
	}
	return count > 0
}

func (s *Service) CreateUser(user *models.User) (*models.User, error) {
	_, err := s.db.Exec("INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
		user.Id, user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.Password, user.CreatedTimestamp, user.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Service) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp FROM users WHERE username = ?", username).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.Password, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) GetUserById(id types.Snowflake) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users WHERE id = ?", id).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) UpdateUser(id types.Snowflake, user *models.User) (*models.User, error) {
	_, err := s.db.Exec("UPDATE users SET username=?, firstname=?, lastname=?, role=?, avatar=?, email=?, updated_timestamp=? WHERE id=?",
		user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.UpdatedTimestamp, id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *Service) UpdatePassword(id types.Snowflake, password string) error {
	_, err := s.db.Exec("UPDATE users SET password=? WHERE id=?", password, id)
	return err
}

func (s *Service) DeleteUser(id types.Snowflake) error {
	_, err := s.db.Exec("DELETE FROM users WHERE id=?", id)
	return err
}
