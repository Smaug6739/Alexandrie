package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"
)

// UserRepositoryImpl implements the UserRepository interface with prepared statements
type UserRepositoryImpl struct {
	db      *sql.DB
	manager *RepositoryManager
}

// UserRepository defines the interface for user repository operations
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

// Prepared statement keys
const (
	stmtUserGetAll                   = "user_get_all"
	stmtUserGetByID                  = "user_get_by_id"
	stmtUserGetByUsername            = "user_get_by_username"
	stmtUserGetByEmail               = "user_get_by_email"
	stmtUserHasPassword              = "user_has_password"
	stmtUserSearchPublic             = "user_search_public"
	stmtUserCheckUsernameExists      = "user_check_username_exists"
	stmtUserCreate                   = "user_create"
	stmtUserUpdate                   = "user_update"
	stmtUserUpdatePassword           = "user_update_password"
	stmtUserUpdatePasswordResetToken = "user_update_password_reset_token"
	stmtUserDelete                   = "user_delete"
)

// NewUserRepository creates a new user repository with prepared statements
func NewUserRepository(db *sql.DB, manager *RepositoryManager) (UserRepository, error) {
	repo := &UserRepositoryImpl{
		db:      db,
		manager: manager,
	}

	if err := repo.prepareStatements(); err != nil {
		return nil, fmt.Errorf("failed to prepare user statements: %w", err)
	}

	return repo, nil
}

// prepareStatements prepares all SQL statements for the user repository
func (r *UserRepositoryImpl) prepareStatements() error {
	statements := map[string]string{
		stmtUserGetAll: `
			SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
			FROM users 
			ORDER BY created_timestamp DESC`,

		stmtUserGetByID: `
			SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
			FROM users 
			WHERE id = ?`,

		stmtUserGetByUsername: `
			SELECT id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp 
			FROM users 
			WHERE username = ?`,

		stmtUserGetByEmail: `
			SELECT id, username, firstname, lastname, role, avatar, email, created_timestamp, updated_timestamp 
			FROM users 
			WHERE email = ?`,

		stmtUserHasPassword: `
			SELECT COUNT(*) 
			FROM users 
			WHERE id = ? AND password IS NOT NULL`,
		stmtUserSearchPublic: `
			SELECT id, username, avatar, created_timestamp, updated_timestamp 
			FROM users 
			WHERE username = ? OR email = ? OR id = ? 
			LIMIT 10`,

		stmtUserCheckUsernameExists: `
			SELECT COUNT(*) 
			FROM users 
			WHERE username = ?`,

		stmtUserCreate: `
			INSERT INTO users (id, username, firstname, lastname, role, avatar, email, password, created_timestamp, updated_timestamp) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

		stmtUserUpdate: `
			UPDATE users 
			SET username=?, firstname=?, lastname=?, avatar=?, email=?, updated_timestamp=? 
			WHERE id=?`,

		stmtUserUpdatePassword: `
			UPDATE users 
			SET password=?, password_reset_token=NULL 
			WHERE id=?`,

		stmtUserUpdatePasswordResetToken: `
			UPDATE users 
			SET password_reset_token=? 
			WHERE id=?`,

		stmtUserDelete: `
			DELETE FROM users 
			WHERE id=?`,
	}

	// Prepare all statements
	for key, query := range statements {
		if _, err := r.manager.PrepareStatement(key, query); err != nil {
			return err
		}
	}

	return nil
}

// GetAll retrieves all users
func (r *UserRepositoryImpl) GetAll() ([]*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserGetAll)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query()
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	users := make([]*models.User, 0)
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Firstname,
			&user.Lastname,
			&user.Role,
			&user.Avatar,
			&user.Email,
			&user.CreatedTimestamp,
			&user.UpdatedTimestamp,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, &user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// GetByID retrieves a user by ID
func (r *UserRepositoryImpl) GetByID(id types.Snowflake) (*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserGetByID)
	if err != nil {
		return nil, err
	}

	var user models.User
	err = stmt.QueryRow(id).Scan(
		&user.Id,
		&user.Username,
		&user.Firstname,
		&user.Lastname,
		&user.Role,
		&user.Avatar,
		&user.Email,
		&user.CreatedTimestamp,
		&user.UpdatedTimestamp,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}

	return &user, nil
}

// GetByUsername retrieves a user by username (includes password)
func (r *UserRepositoryImpl) GetByUsername(username string) (*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserGetByUsername)
	if err != nil {
		return nil, err
	}

	var user models.User
	err = stmt.QueryRow(username).Scan(
		&user.Id,
		&user.Username,
		&user.Firstname,
		&user.Lastname,
		&user.Role,
		&user.Avatar,
		&user.Email,
		&user.Password,
		&user.CreatedTimestamp,
		&user.UpdatedTimestamp,
	)

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
	stmt, err := r.manager.GetStatement(stmtUserGetByEmail)
	if err != nil {
		return nil, err
	}

	var user models.User
	err = stmt.QueryRow(email).Scan(
		&user.Id,
		&user.Username,
		&user.Firstname,
		&user.Lastname,
		&user.Role,
		&user.Avatar,
		&user.Email,
		&user.CreatedTimestamp,
		&user.UpdatedTimestamp,
	)

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
	stmt, err := r.manager.GetStatement(stmtUserHasPassword)
	if err != nil {
		return false, err
	}

	var count int
	err = stmt.QueryRow(id).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check if user has password: %w", err)
	}

	return count > 0, nil
}

// SearchPublic searches for public user profiles
func (r *UserRepositoryImpl) SearchPublic(query string) ([]*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserSearchPublic)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(query, query, query)
	if err != nil {
		return nil, fmt.Errorf("failed to search public users: %w", err)
	}
	defer rows.Close()

	users := make([]*models.User, 0)
	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Avatar,
			&user.CreatedTimestamp,
			&user.UpdatedTimestamp,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, &user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// CheckUsernameExists checks if a username already exists
func (r *UserRepositoryImpl) CheckUsernameExists(username string) (bool, error) {
	stmt, err := r.manager.GetStatement(stmtUserCheckUsernameExists)
	if err != nil {
		return false, err
	}

	var count int
	err = stmt.QueryRow(username).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check username exists: %w", err)
	}

	return count > 0, nil
}

// Create creates a new user
func (r *UserRepositoryImpl) Create(user *models.User) (*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserCreate)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(
		user.Id,
		user.Username,
		user.Firstname,
		user.Lastname,
		user.Role,
		user.Avatar,
		user.Email,
		user.Password,
		user.CreatedTimestamp,
		user.UpdatedTimestamp,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

// Update updates an existing user
func (r *UserRepositoryImpl) Update(id types.Snowflake, user *models.User) (*models.User, error) {
	stmt, err := r.manager.GetStatement(stmtUserUpdate)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(
		user.Username,
		user.Firstname,
		user.Lastname,
		user.Avatar,
		user.Email,
		user.UpdatedTimestamp,
		id,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return user, nil
}

// UpdatePassword updates a user's password
func (r *UserRepositoryImpl) UpdatePassword(id types.Snowflake, password string) error {
	stmt, err := r.manager.GetStatement(stmtUserUpdatePassword)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(password, id)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	return nil
}

// UpdatePasswordResetToken updates a user's password reset token
func (r *UserRepositoryImpl) UpdatePasswordResetToken(id types.Snowflake, resetToken string) error {
	stmt, err := r.manager.GetStatement(stmtUserUpdatePasswordResetToken)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(resetToken, id)
	if err != nil {
		return fmt.Errorf("failed to update password reset token: %w", err)
	}

	return nil
}

// Delete deletes a user
func (r *UserRepositoryImpl) Delete(id types.Snowflake) error {
	stmt, err := r.manager.GetStatement(stmtUserDelete)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}
