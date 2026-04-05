package services

import (
	"alexandrie/models"
	"alexandrie/permissions"
	"alexandrie/pkg/logger"
	"alexandrie/pkg/snowflake"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"regexp"
	"slices"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	GetAllUsers() ([]*models.User, error)
	GetUserById(ctx context.Context, id types.Snowflake) (*models.User, error)
	GetUserByUsername(username string) (*models.User, error)
	SearchPublicUsers(query string) ([]*models.User, error)
	CreateUser(username string, firstname, lastname, avatar, email string, password *string) (*models.User, error)
	UpdateUser(ctx context.Context, id types.Snowflake, firstname, lastname, avatar, email *string) (*models.User, error)
	UpdatePassword(ctx context.Context, id types.Snowflake, newPassword string) error
	DeleteUser(ctx context.Context, id types.Snowflake, minioService MinioService) error
	GenerateUniqueUsername(givenName *string, userID types.Snowflake) string
	LoadAppAdmins()
}

type userService struct {
	userRepo  repositories.UserRepository
	logRepo   repositories.LogRepository
	snowflake *snowflake.Snowflake
	access    permissions.AccessGuard
}

func NewUserService(userRepo repositories.UserRepository, logRepo repositories.LogRepository, snowflake *snowflake.Snowflake, access permissions.AccessGuard) UserService {
	userService := &userService{
		userRepo:  userRepo,
		logRepo:   logRepo,
		snowflake: snowflake,
		access:    access,
	}
	userService.LoadAppAdmins() // On startup, ensure admin users are loaded and updated
	return userService
}

func (s *userService) GetAllUsers() ([]*models.User, error) {
	return s.userRepo.GetAll()
}

func (s *userService) GetUserById(ctx context.Context, id types.Snowflake) (*models.User, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if err := s.access.RequireUserAccess(actor, id); err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, permissions.ErrNotFound
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

func (s *userService) UpdateUser(ctx context.Context, id types.Snowflake, firstname, lastname, avatar, email *string) (*models.User, error) {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if err := s.access.RequireUserAccess(actor, id); err != nil {
		return nil, err
	}

	dbUser, err := s.userRepo.GetByID(id)
	if err != nil || dbUser == nil {
		return nil, permissions.ErrNotFound
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

func (s *userService) UpdatePassword(ctx context.Context, id types.Snowflake, newPassword string) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}
	if err := s.access.RequireUserAccess(actor, id); err != nil {
		return err
	}

	if newPassword == "" {
		return errors.New("password is required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	return s.userRepo.UpdatePassword(id, string(hash))
}

func (s *userService) DeleteUser(ctx context.Context, id types.Snowflake, minioService MinioService) error {
	actor, err := actorFromContext(ctx)
	if err != nil {
		return err
	}
	if err := s.access.RequireUserAccess(actor, id); err != nil {
		return err
	}

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

func sanitizeUsername(name string) string {
	name = strings.ReplaceAll(name, " ", "_")
	name = reg.ReplaceAllString(name, "")
	if len(name) > 20 {
		name = name[:20]
	}
	return name
}

func generateRandomBase() string {
	randBytes := make([]byte, 2)
	rand.Read(randBytes)
	adj := usernameAdjectives[int(randBytes[0])%len(usernameAdjectives)]
	return fmt.Sprintf("Alex-%s", adj)
}

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

func (s *userService) LoadAppAdmins() {
	adminIDs := utils.GetEnvAsSlice("ADMIN_ACCOUNTS", ",")

	// Remove admin role from all users not in the current admin list
	existingAdmins, err := s.userRepo.GetAppAdmins()

	if err != nil {
		logger.Warn("app-admins", "Failed to load existing admin users: "+err.Error())
		return
	}

	for _, admin := range existingAdmins {
		if !slices.Contains(adminIDs, admin.Id.String()) {
			err := s.userRepo.UpdateRole(admin.Id, int(permissions.RoleNone))
			if err != nil {
				logger.Error("app-admins", "Failed to update user "+admin.Username+" to regular role: "+err.Error())
			} else {
				logger.Info("app-admins", "User "+admin.Username+" has been set to regular role.")
			}
		}
	}

	// Add new admins from the environment variable
	for _, idStr := range adminIDs {
		id, err := types.SnowflakeFromString(idStr)
		if err != nil {
			logger.Warn("app-admins", "Invalid admin user ID: "+idStr)
			continue
		}
		user, err := s.userRepo.GetByID(*id)
		if err != nil || user == nil {
			logger.Warn("app-admins", "Failed to load admin user with ID "+idStr+"\nCheck if the ID is correct and if the user exists.")
			continue
		}
		if user.Role != int(permissions.RoleAdministrator) {
			err := s.userRepo.UpdateRole(user.Id, int(permissions.RoleAdministrator))
			if err != nil {
				logger.Warn("app-admins", "Failed to update user "+user.Username+" to admin role: "+err.Error())
			} else {
				logger.Info("app-admins", "User "+user.Username+" has been granted admin role.")
			}
		} else {
			logger.Info("app-admins", "User "+user.Username+" is already an admin.")
		}
	}

}
