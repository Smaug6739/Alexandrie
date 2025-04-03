package models

import (
	"database/sql"
	"errors"
)

type User struct {
	Id               int64   `form:"id" binding:"omitempty"`
	Username         string  `form:"username" binding:"required,min=5,max=30"`
	Firstname        *string `form:"firstname" binding:"omitempty"`
	Lastname         *string `form:"lastname" binding:"omitempty"`
	Role             int     `form:"role" binding:"omitempty"` // 1: user, 2: admin
	Avatar           *string `form:"avatar" binding:"omitempty"`
	Email            string  `form:"email" binding:"required,email"`
	Password         string  `form:"password" json:"password,omitempty" binding:"omitempty,min=4,max=50"`
	CreatedTimestamp int64   `form:"created_timestamp" binding:"omitempty"`
	UpdatedTimestamp int64   `form:"updated_timestamp" binding:"omitempty"`
}

type UserService interface {
	GetAllUsers() ([]User, error)
	GetUser(id int64) (*User, error)
	CheckUsernameExists(username string) bool
	GetUserByUsername(username string) (*User, error)
	GetUserById(id int64) (*User, error)
	CreateUser(user User) (*User, error)
	UpdateUser(id int64, user User) (*User, error)
	UpdatePassword(id int64, password string) error
	DeleteUser(id int64) error
}

func NewUserService(db *sql.DB) UserService {
	return &Model{DB: db}
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

func (m *Model) GetUser(id int64) (*User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp FROM users WHERE id = ?", id).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.Password, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *Model) CheckUsernameExists(username string) bool {
	var count int
	err := m.DB.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", username).Scan(&count)
	if err != nil {
		return false
	}
	return count > 0
}

func (m *Model) GetUserByUsername(username string) (*User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp FROM users WHERE username = ?", username).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.Password, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *Model) GetUserById(id int64) (*User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp FROM users WHERE id = ?", id).Scan(
		&user.Id, &user.Username, &user.Firstname, &user.Lastname,
		&user.Role, &user.Avatar, &user.Email, &user.CreatedTimestamp, &user.UpdatedTimestamp,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
}
func (m *Model) CreateUser(user User) (*User, error) {
	_, err := m.DB.Exec("INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
		user.Id, user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.Password, user.CreatedTimestamp, user.UpdatedTimestamp)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *Model) UpdateUser(id int64, user User) (*User, error) {
	_, err := m.DB.Exec("UPDATE users SET username=?, firstname=?, lastname=?, role=?, avatar=?, email=?, updated_timestamp=? WHERE id=?",
		user.Username, user.Firstname, user.Lastname, user.Role, user.Avatar, user.Email, user.UpdatedTimestamp, id)
	if err != nil {
		return nil, err
	}
	user.Id = id
	return &user, nil
}

func (m *Model) UpdatePassword(id int64, password string) error {
	_, err := m.DB.Exec("UPDATE users SET password=? WHERE id=?", password, id)
	return err
}

func (m *Model) DeleteUser(id int64) error {
	_, err := m.DB.Exec("DELETE FROM users WHERE id=?", id)
	return err
}
