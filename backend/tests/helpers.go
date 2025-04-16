package tests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"
)

const BaseURL = "http://localhost:8080/api"
const ADMIN_USERNAME = "Smaug"
const ADMIN_PASSWORD = "10082005"
const USER_USERNAME = "Balthazar"
const USER_PASSWORD = "10082005"
const USER_ID = "564704938298982405"

type APIResponse struct {
	Status     string `json:"status"`
	Timestamp  int64  `json:"timestamp"`
	Message    string `json:"message,omitempty"`
	Result     any    `json:"result,omitempty"`
	StatusCode int
}

func DoPost(t *testing.T, client *http.Client, path string, body any) APIResponse {
	var contentType string
	var reader io.Reader
	switch b := body.(type) {
	case map[string]any:
		jsonBody, err := json.Marshal(b)
		if err != nil {
			t.Fatalf("Erreur de marshal JSON: %v", err)
		}
		reader = bytes.NewReader(jsonBody)
		if contentType == "" {
			contentType = "application/json"
		}
	case string:
		reader = strings.NewReader(b)
		if contentType == "" {
			contentType = "application/x-www-form-urlencoded"
		}
	case nil:
		reader = nil
	default:
		t.Fatalf("Type de body non supporté: %T", body)
	}
	resp, err := client.Post(BaseURL+path, contentType, reader)
	if err != nil {
		t.Fatalf("POST %s failed: %v", path, err)
	}
	val := ParseJSONResponse[APIResponse](t, resp)
	val.StatusCode = resp.StatusCode
	return val
}

func DoGet(t *testing.T, client *http.Client, path string) APIResponse {
	resp, err := client.Get(BaseURL + path)
	if err != nil {
		t.Fatalf("GET %s failed: %v", path, err)
	}
	val := ParseJSONResponse[APIResponse](t, resp)
	val.StatusCode = resp.StatusCode
	return val
}

func DoDelete(t *testing.T, client *http.Client, path string) APIResponse {
	// Create request
	req, err := http.NewRequest(http.MethodDelete, BaseURL+path, nil)
	if err != nil {
		t.Fatalf("Error creating request: %v", err)
	}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("DELETE %s failed: %v", path, err)
	}
	val := ParseJSONResponse[APIResponse](t, resp)
	val.StatusCode = resp.StatusCode
	return val
}

func DoPatch(t *testing.T, client *http.Client, path string, body any) APIResponse {
	var contentType string
	var reader io.Reader

	switch b := body.(type) {
	case map[string]any:
		jsonBody, err := json.Marshal(b)
		if err != nil {
			t.Fatalf("Erreur de marshal JSON: %v", err)
		}
		reader = bytes.NewReader(jsonBody)
		if contentType == "" {
			contentType = "application/json"
		}
	case string:
		reader = strings.NewReader(b)
		if contentType == "" {
			contentType = "application/x-www-form-urlencoded"
		}
	case nil:
		reader = nil
	default:
		t.Fatalf("Type de body non supporté: %T", body)
	}
	req, err := http.NewRequest(http.MethodPatch, BaseURL+path, reader)
	if err != nil {
		t.Fatalf("Error creating request: %v", err)
	}
	req.Header.Set("Content-Type", contentType)

	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("PATCH %s failed: %v", path, err)
	}
	val := ParseJSONResponse[APIResponse](t, resp)
	val.StatusCode = resp.StatusCode
	return val
}

func ParseJSONResponse[T any](t *testing.T, resp *http.Response) T {
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Error during response reading: %v", err)
	}

	var data T

	// Ce bloc permet d’utiliser json.Number dans les maps dynamiques
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.UseNumber()

	if err := decoder.Decode(&data); err != nil {
		t.Fatalf("Error unmarshal JSON: %v\nBody:\n%s", err, body)
	}
	return data
}
