package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(id types.Snowflake) (map[string]interface{}, error)
	GetUserByUsername(username string) (*models.User, error)
	SearchPublicUsers(query string) ([]*models.User, error)
	CreateUser(username, firstname, lastname, avatar, email, password string) (*models.User, error)
	UpdateUser(id types.Snowflake, firstname, lastname, avatar, email *string) (*models.User, error)
	UpdatePassword(id types.Snowflake, newPassword string) error
	DeleteUser(id types.Snowflake, minioService MinioService) error
}

type userService struct {
	userRepo repositories.UserRepository
	logRepo  repositories.LogRepository
	snowflake *utils.Snowflake
}

func NewUserService(userRepo repositories.UserRepository, logRepo repositories.LogRepository, snowflake *utils.Snowflake) UserService {
	return &userService{
		userRepo:  userRepo,
		logRepo:   logRepo,
		snowflake: snowflake,
	}
}

func (s *userService) GetAllUsers() ([]*models.User, error) {
	return s.userRepo.GetAll()
}

func (s *userService) GetUserById(id types.Snowflake) (map[string]interface{}, error) {
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	lastConnection, _ := s.logRepo.GetLastByUserID(id)

	return map[string]interface{}{
		"user":            user,
		"last_connection": lastConnection,
	}, nil
}

func (s *userService) GetUserByUsername(username string) (*models.User, error) {
	return s.userRepo.GetByUsername(username)
}

func (s *userService) SearchPublicUsers(query string) ([]*models.User, error) {
	return s.userRepo.SearchPublic(query)
}

func (s *userService) CreateUser(username, firstname, lastname, avatar, email, password string) (*models.User, error) {
	exists, err := s.userRepo.CheckUsernameExists(username)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("username already exists")
	}

	if len(password) == 0 {
		return nil, errors.New("password is required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &models.User{
		Id:               s.snowflake.Generate(),
		Username:         username,
		Firstname:        &firstname,
		Lastname:         &lastname,
		Avatar:           &avatar,
		Role:             1,
		Email:            email,
		Password:         string(hash),
		CreatedTimestamp: time.Now().UnixMilli(),
		UpdatedTimestamp: time.Now().UnixMilli(),
	}

	createdUser, err := s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}
	createdUser.Password = ""
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
		Email:            utils.IfNotNilValue(email, dbUser.Email),
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
