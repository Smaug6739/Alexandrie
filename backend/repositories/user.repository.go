package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type UserRepositoryImpl struct {
	db *sqlx.DB
}

type UserRepository interface {
	GetAll() ([]*models.User, error)
	GetByID(id types.Snowflake) (*models.User, error)
	GetByUsername(username string) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
	HasPassword(id types.Snowflake) (bool, error)
	SearchPublic(query string) ([]*models.User, error)
	CheckUsernameExists(username string) (bool, error)
	Create(user *models.User) (*models.User, error)
	Update(id types.Snowflake, user *models.User) (*models.User, error)
	UpdatePassword(id types.Snowflake, password string) error
	UpdatePasswordResetToken(id types.Snowflake, resetToken string) error
	Delete(id types.Snowflake) error
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return &UserRepositoryImpl{db: db}
}

// GetAll retrieves all users
func (r *UserRepositoryImpl) GetAll() ([]*models.User, error) {
	var users []*models.User
	err := r.db.Select(&users, `
		SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
		FROM users 
		ORDER BY created_timestamp DESC`)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	return users, nil
}

// GetByID retrieves a user by ID
func (r *UserRepositoryImpl) GetByID(id types.Snowflake) (*models.User, error) {
	var user models.User
	err := r.db.Get(&user, `
		SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
		FROM users 
		WHERE id = ?`, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &user, nil
}

// GetByUsername retrieves a user by username (includes password for authentication)
func (r *UserRepositoryImpl) GetByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.db.Get(&user, `
		SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp 
		FROM users 
		WHERE username = ?`, username)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}

// GetByEmail retrieves a user by email
func (r *UserRepositoryImpl) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Get(&user, `
		SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
		FROM users 
		WHERE email = ?`, email)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &user, nil
}

// HasPassword checks if a user has a password set
func (r *UserRepositoryImpl) HasPassword(id types.Snowflake) (bool, error) {
	var count int
	err := r.db.Get(&count, `SELECT COUNT(*) FROM users WHERE id = ? AND password IS NOT NULL`, id)
	if err != nil {
		return false, fmt.Errorf("failed to check if user has password: %w", err)
	}
	return count > 0, nil
}

// SearchPublic searches for public user profiles
func (r *UserRepositoryImpl) SearchPublic(query string) ([]*models.User, error) {
	var users []*models.User
	err := r.db.Select(&users, `
		SELECT id, username, avatar, created_timestamp, updated_timestamp 
		FROM users 
		WHERE username = ? OR email = ? OR id = ? 
		LIMIT 10`, query, query, query)
	if err != nil {
		return nil, fmt.Errorf("failed to search public users: %w", err)
	}
	return users, nil
}

// CheckUsernameExists checks if a username already exists
func (r *UserRepositoryImpl) CheckUsernameExists(username string) (bool, error) {
	var count int
	err := r.db.Get(&count, `SELECT COUNT(*) FROM users WHERE username = ?`, username)
	if err != nil {
		return false, fmt.Errorf("failed to check username exists: %w", err)
	}
	return count > 0, nil
}

// Create creates a new user
func (r *UserRepositoryImpl) Create(user *models.User) (*models.User, error) {
	_, err := r.db.NamedExec(`
		INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) 
		VALUES (:id, :username, :firstname, :lastname, :role, :avatar, :email, :password, :created_timestamp, :updated_timestamp)`,
		user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return user, nil
}

// Update updates an existing user
func (r *UserRepositoryImpl) Update(id types.Snowflake, user *models.User) (*models.User, error) {
	_, err := r.db.Exec(`
		UPDATE users 
		SET username=?, firstname=?, lastname=?, avatar=?, email=?, updated_timestamp=? 
		WHERE id=?`,
		user.Username, user.Firstname, user.Lastname, user.Avatar, user.Email, user.UpdatedTimestamp, id)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return user, nil
}

// UpdatePassword updates a user's password
func (r *UserRepositoryImpl) UpdatePassword(id types.Snowflake, password string) error {
	_, err := r.db.Exec(`UPDATE users SET password=?, password_reset_token=NULL WHERE id=?`, password, id)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}
	return nil
}

// UpdatePasswordResetToken updates a user's password reset token
func (r *UserRepositoryImpl) UpdatePasswordResetToken(id types.Snowflake, resetToken string) error {
	_, err := r.db.Exec(`UPDATE users SET password_reset_token=? WHERE id=?`, resetToken, id)
	if err != nil {
		return fmt.Errorf("failed to update password reset token: %w", err)
	}
	return nil
}

// Delete deletes a user
func (r *UserRepositoryImpl) Delete(id types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM users WHERE id=?`, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}
