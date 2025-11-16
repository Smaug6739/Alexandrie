package services

import (
	"alexandrie/models"
	"alexandrie/repositories"
	"alexandrie/types"
	"alexandrie/utils"
	"crypto/rand"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/wneessen/go-mail"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(username, password, ip, userAgent string) (*models.User, *models.Session, error)
	RefreshSession(refreshToken string) (*models.User, *models.Session, error)
	Logout(refreshToken string) error
	LogoutAllDevices(userId types.Snowflake) error
	RequestPasswordReset(username string, mailClient *mail.Client) error
	ResetPassword(token, newPassword string) error
	SignAccessToken(user *models.User, accessTokenExpiry int) (string, error)
}

type authService struct {
	userRepo    repositories.UserRepository
	sessionRepo repositories.SessionRepository
	logRepo     repositories.LogRepository
	snowflake   *utils.Snowflake
}

func NewAuthService(userRepo repositories.UserRepository, sessionRepo repositories.SessionRepository, logRepo repositories.LogRepository, snowflake *utils.Snowflake) AuthService {
	return &authService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		logRepo:     logRepo,
		snowflake:   snowflake,
	}
}

// Login user
// Find the user by username
// Compare the password with the hashed password
// Create a new session with a refresh token
// Return the user and session
func (s *authService) Login(username, password, ip, userAgent string) (*models.User, *models.Session, error) {

	user, err := s.userRepo.GetByUsername(username)

	if user == nil || err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	session := &models.Session{
		Id:                   s.snowflake.Generate(),
		UserId:               user.Id,
		RefreshToken:         signRefreshToken(),
		ExpireToken:          time.Now().Add(time.Duration(30 * 24 * time.Hour)).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}

	if _, err := s.sessionRepo.Create(session); err != nil {
		return nil, nil, errors.New("failed to create session")
	}

	go func() {
		s.logRepo.Create(&models.Log{
			Id:        s.snowflake.Generate(),
			UserId:    user.Id,
			IpAddr:    ip,
			Timestamp: time.Now().UnixMilli(),
			Type:      "login",
			Location:  s.logRepo.GetLocationFromIP(ip),
			UserAgent: userAgent,
		})
	}()

	user.Password = ""
	return user, session, nil
}

func (s *authService) RefreshSession(refreshToken string) (*models.User, *models.Session, error) {
	session, err := s.sessionRepo.GetByRefreshToken(refreshToken)
	if err != nil {
		return nil, nil, errors.New("invalid refresh token")
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		return nil, nil, errors.New("refresh token expired")
	}

	user, err := s.userRepo.GetByID(session.UserId)
	if user == nil || err != nil {
		return nil, nil, errors.New("failed to get user")
	}

	session.RefreshToken = signRefreshToken()
	session.ExpireToken = time.Now().Add(time.Duration(30 * 24 * time.Hour)).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()

	if _, err = s.sessionRepo.Update(session); err != nil {
		return nil, nil, errors.New("failed to update session")
	}

	user.Password = ""
	return user, session, nil
}

func (s *authService) Logout(refreshToken string) error {
	session, err := s.sessionRepo.GetByRefreshToken(refreshToken)
	if err != nil {
		return errors.New("invalid refresh token")
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		return errors.New("refresh token expired")
	}
	return s.sessionRepo.Delete(session.Id)
}

func (s *authService) LogoutAllDevices(userId types.Snowflake) error {
	return s.sessionRepo.DeleteAllByUser(userId)
}

func (s *authService) RequestPasswordReset(username string, mailClient *mail.Client) error {
	if mailClient == nil {
		return errors.New("mail client not configured")
	}

	user, err := s.userRepo.GetByUsername(username)
	if user == nil || err != nil {
		return nil // Don't reveal if user exists
	}

	resetToken := signResetToken(user.Id)
	if err := s.userRepo.UpdatePasswordResetToken(user.Id, resetToken); err != nil {
		return nil // Don't reveal errors
	}

	message := mail.NewMsg()
	message.FromFormat("Alexandrie Team", os.Getenv("SMTP_MAIL"))
	message.To(user.Email)
	message.Subject("Alexandrie: Password Reset")
	message.SetBodyString(mail.TypeTextPlain, fmt.Sprintf("Your password reset link is: %s", os.Getenv("DOMAIN_CLIENT")+"/login/reset?token="+resetToken))

	if err := mailClient.DialAndSend(message); err != nil {
		return nil // Don't reveal errors
	}
	return nil
}

func (s *authService) ResetPassword(token, newPassword string) error {
	claims := jwt.RegisteredClaims{}
	parsedToken, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !parsedToken.Valid {
		return errors.New("invalid reset token")
	}

	userId, err := strconv.ParseUint(claims.Subject, 10, 64)
	if err != nil {
		return errors.New("invalid user ID in reset token")
	}

	user, err := s.userRepo.GetByID(types.Snowflake(userId))
	if user == nil || err != nil {
		return errors.New("failed to get user")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	return s.userRepo.UpdatePassword(user.Id, string(hash))
}

func (s *authService) SignAccessToken(user *models.User, accessTokenExpiry int) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  strconv.FormatUint(uint64(user.Id), 10),
		"iss":  "alexandrie",
		"exp":  time.Now().Add(time.Duration(time.Second * time.Duration(accessTokenExpiry))).Unix(),
		"iat":  time.Now().Unix(),
		"role": strconv.Itoa(user.Role),
	})
	return claims.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func signRefreshToken() string {
	randBytes := make([]byte, 45)
	rand.Read(randBytes)
	return fmt.Sprintf("%x", randBytes)
}

func signResetToken(userId types.Snowflake) string {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": strconv.FormatUint(uint64(userId), 10),
		"exp": time.Now().Add(time.Duration(time.Minute * 20)).Unix(),
	})
	tokenString, err := claims.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return ""
	}
	return tokenString
}
