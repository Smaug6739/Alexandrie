package controllers

import (
	"Smaug6739/Alexandrie/app"
	"Smaug6739/Alexandrie/models"
	"crypto/rand"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	app   *app.App
	model *models.Model
}

var refresh_token_expiration = 7 * 24 * 60 * 60 * 1000 // 7 days

func NewAuthController(app *app.App) *AuthController {
	return &AuthController{
		app:   app,
		model: models.NewModel(app.DB),
	}
}

// Connexion:
// L'utilisateur fournit son nom d'utilisateur et son mot de passe.
// Si les informations sont correctes, un token JWT est généré et renvoyé à l'utilisateur.
// On signe également un refresh token (chaine aléatoire) et on le stocke en base de données dans une (Session) table.
// On set un cookie avec le refresh token & l'access token.
// On renvoit l'User sans le mot de passe.

func (dc *AuthController) Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	fmt.Println(username, password)

	if username == "" || password == "" {
		c.JSON(400, gin.H{"error": "Invalid credentials. 1"})
		return
	}
	user := dc.model.GetUserByUsername(username)

	macth_err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if macth_err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials."})
		return
	}
	tokenString, err := dc.signAccessToken(user)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(500, gin.H{"error": "Failed to sign token."})

		return
	}

	// Create a new session
	session := models.Session{
		Id:                   dc.app.Snowflake.Generate(),
		UserId:               user.Id,
		RefreshToken:         signRefreshToken(),
		ExpireToken:          time.Now().Add(time.Duration(refresh_token_expiration * 1000)).UnixMilli(),
		LastRefreshTimestamp: time.Now().UnixMilli(),
		Active:               1,
		LoginTimestamp:       time.Now().UnixMilli(),
		LogoutTimestamp:      0,
	}
	_, errs := dc.model.CreateSession(&session)
	if errs != nil {
		c.JSON(500, gin.H{"error": "Failed to create session."})
		return
	}

	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true) // TODO: Replace with config
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(refresh_token_expiration).Seconds()), "/", "localhost", false, true)

	c.JSON(200, gin.H{"message": "Login successful"})

}

func (dc *AuthController) RefreshSession(c *gin.Context) {
	// Get the refresh token from the cookie
	refreshToken, err := c.Cookie("RefreshToken")
	if err != nil {
		c.JSON(401, gin.H{"error": "No refresh token provided."})
		return
	}
	session, err := dc.model.GetSession(refreshToken)
	if err != nil {
		c.JSON(401, gin.H{"error": "Invalid refresh token."})
		return
	}
	if session.ExpireToken < time.Now().UnixMilli() {
		c.JSON(401, gin.H{"error": "Refresh token expired."})
		return
	}
	// Generate a new access token
	user := dc.model.GetUserById(session.UserId)
	tokenString, err := dc.signAccessToken(user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to sign token."})
		return
	}
	// Update the session
	session.RefreshToken = signRefreshToken()
	session.ExpireToken = time.Now().Add(time.Duration(refresh_token_expiration)).UnixMilli()
	session.LastRefreshTimestamp = time.Now().UnixMilli()
	_, err = dc.model.UpdateSession(&session)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update session."})
		return
	}
	c.SetCookie("Authorization", tokenString, 1800, "/", "localhost", false, true) // TODO: Replace with config
	c.SetCookie("RefreshToken", session.RefreshToken, int(time.Duration(refresh_token_expiration).Seconds()), "/", "localhost", false, true)
	c.JSON(200, gin.H{"message": "Token refreshed."})

}

func (dc *AuthController) signAccessToken(user models.User) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.Username,                    // Subject (user identifier)
		"iss": "alexandrie",                     // Issuer
		"aud": user.Role,                        // Audience (user role)
		"exp": time.Now().Add(time.Hour).Unix(), // Expiration time // TODO: Replace with config
		"iat": time.Now().Unix(),                // Issued at
	})
	tokenString, err := claims.SignedString([]byte("secretKey")) // TODO: Replace with config
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Crypto create random string hex 64
func signRefreshToken() string {
	randBytes := make([]byte, 45)
	rand.Read(randBytes)
	return fmt.Sprintf("%x", randBytes)
}
