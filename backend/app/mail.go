package app

import (
	"log"
	"os"

	"github.com/wneessen/go-mail"
)

func GetMailClient() *mail.Client {
	host := os.Getenv("SMTP_HOST")
	username := os.Getenv("SMTP_MAIL")
	password := os.Getenv("SMTP_PASSWORD")

	if host == "" || username == "" || password == "" {
		return nil
	}
	client, err := mail.NewClient(host, mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(username), mail.WithPassword(password), mail.WithSSLPort(true), mail.WithSSL())
	if err != nil {
		log.Fatalf("failed to create mail client: %s", err)
	}
	return client
}
