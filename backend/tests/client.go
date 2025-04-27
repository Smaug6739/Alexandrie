package tests

import (
	"net/http"
	"net/http/cookiejar"
	"testing"
)

var client *http.Client

func InitClient(t *testing.T) *http.Client {
	if client != nil {
		return client
	}
	jar, err := cookiejar.New(nil)
	if err != nil {
		t.Fatalf("Error with client init: %v", err)
	}
	client = &http.Client{Jar: jar}
	return client
}
