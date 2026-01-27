package services

import (
	"alexandrie/models"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"crypto/rand"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(id types.Snowflake) (*models.User, error)
	GetUserByUsername(username string) (*models.User, error)
	SearchPublicUsers(query string) ([]*models.User, error)
	CreateUser(username string, firstname, lastname, avatar, email string, password *string) (*models.User, error)
	UpdateUser(id types.Snowflake, firstname, lastname, avatar, email *string) (*models.User, error)
	UpdatePassword(id types.Snowflake, newPassword string) error
	DeleteUser(id types.Snowflake, minioService MinioService) error
	GenerateUniqueUsername(givenName *string, userID types.Snowflake) string
}

type userService struct {
	userRepo  repositories.UserRepository
	logRepo   repositories.LogRepository
	snowflake *snowflake.Snowflake
}

func NewUserService(userRepo repositories.UserRepository, logRepo repositories.LogRepository, snowflake *snowflake.Snowflake) UserService {
	return &userService{
		userRepo:  userRepo,
		logRepo:   logRepo,
		snowflake: snowflake,
	}
}

func (s *userService) GetAllUsers() ([]*models.User, error) {
	return s.userRepo.GetAll()
}

func (s *userService) GetUserById(id types.Snowflake) (*models.User, error) {
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	return user, nil
}

func (s *userService) GetUserByUsername(username string) (*models.User, error) {
	return s.userRepo.GetByUsername(username)
}

func (s *userService) SearchPublicUsers(query string) ([]*models.User, error) {
	return s.userRepo.SearchPublic(query)
}

func (s *userService) CreateUser(username, firstname, lastname, avatar, email string, password *string) (*models.User, error) {
	exists, err := s.userRepo.CheckUsernameExists(username)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("username already exists")
	}

	if password == nil || len(*password) == 0 {
		return nil, errors.New("password is required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	hashStr := string(hash)
	user := &models.User{
		Id:               s.snowflake.Generate(),
		Username:         username,
		Firstname:        &firstname,
		Lastname:         &lastname,
		Avatar:           &avatar,
		Role:             1,
		Email:            &email,
		Password:         &hashStr,
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	createdUser, err := s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}
	createdUser.Password = nil
	return createdUser, nil
}

func (s *userService) UpdateUser(id types.Snowflake, firstname, lastname, avatar, email *string) (*models.User, error) {
	dbUser, err := s.userRepo.GetByID(id)
	if err != nil || dbUser == nil {
		return nil, errors.New("user not found")
	}

	user := &models.User{
		Id:               id,
		Username:         dbUser.Username,
		Firstname:        utils.IfNotNilPointer(firstname, dbUser.Firstname),
		Lastname:         utils.IfNotNilPointer(lastname, dbUser.Lastname),
		Avatar:           utils.IfNotNilPointer(avatar, dbUser.Avatar),
		Email:            utils.IfNotNilPointer(email, dbUser.Email),
		CreatedTimestamp: dbUser.CreatedTimestamp,
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	return s.userRepo.Update(id, user)
}

func (s *userService) UpdatePassword(id types.Snowflake, newPassword string) error {
	if newPassword == "" {
		return errors.New("password is required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	return s.userRepo.UpdatePassword(id, string(hash))
}

func (s *userService) DeleteUser(id types.Snowflake, minioService MinioService) error {
	if minioService != nil {
		if err := minioService.DeleteAllFromUser(id); err != nil {
			return err
		}
	}
	return s.userRepo.Delete(id)
}

var usernameAdjectives = []string{
	"Brave", "Clever", "Swift", "Mighty", "Nimble",
	"Wise", "Bold", "Fierce", "Loyal", "Gentle",
	"Bright", "Calm", "Daring", "Epic", "Fast",
}
var reg = regexp.MustCompile(`[^a-zA-Z0-9_-]`)

// sanitizeUsername removes or replaces invalid characters from a username
func sanitizeUsername(name string) string {
	name = strings.ReplaceAll(name, " ", "_")
	name = reg.ReplaceAllString(name, "")
	if len(name) > 20 {
		name = name[:20]
	}
	return name
}

// generateRandomBase generates a random username base like "Alex-Brave-1234"
func generateRandomBase() string {
	randBytes := make([]byte, 2)
	rand.Read(randBytes)
	adj := usernameAdjectives[int(randBytes[0])%len(usernameAdjectives)]
	return fmt.Sprintf("Alex-%s", adj)
}

// GenerateUniqueUsername generates a unique username based on a given name and user ID.
// If givenName is nil or empty, a random username base is generated.
// Uniqueness is guaranteed by appending the last 6 digits of the user's Snowflake ID,
// which is already guaranteed to be unique.
func (s *userService) GenerateUniqueUsername(givenName *string, userID types.Snowflake) string {
	var baseUsername string

	// Determine the base username
	if givenName != nil && strings.TrimSpace(*givenName) != "" {
		baseUsername = sanitizeUsername(strings.TrimSpace(*givenName))
	}

	if baseUsername == "" {
		baseUsername = generateRandomBase()
	}

	idSuffix := fmt.Sprintf("%06d", int64(userID)%1000000)

	return fmt.Sprintf("%s-%s", baseUsername, idSuffix)
}
