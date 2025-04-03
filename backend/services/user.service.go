package service

import (
	"Smaug6739/Alexandrie/models"
	"database/sql"
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(id int64) (*models.User, error)
	CreateUser(user *models.User) (*models.User, error)
	UpdateUser(user *models.User) (*models.User, error)
	UpdatePassword(id int64, password string) error
	DeleteUser(id int64) error
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
func (s *Service) CreateUser(user *models.User) (*models.User, error) {
	_, err := s.db.Exec("INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
		user.Id, user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.Password, user.CreatedTimestamp, user.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Service) GetUserById(id int64) (*models.User, error) {
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

func (s *Service) UpdateUser(user *models.User) (*models.User, error) {
	_, err := s.db.Exec("UPDATE users SET username=?, firstname=?, lastname=?, role=?, avatar=?, email=?, updated_timestamp=? WHERE id=?",
		user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.UpdatedTimestamp, user.Id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *Service) UpdatePassword(id int64, password string) error {
	_, err := s.db.Exec("UPDATE users SET password=? WHERE id=?", password, id)
	return err
}

func (s *Service) DeleteUser(id int64) error {
	_, err := s.db.Exec("DELETE FROM users WHERE id=?", id)
	return err
}
