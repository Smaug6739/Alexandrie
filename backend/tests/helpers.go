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

func DoGet(t *testing.T, client *http.Client, path string) *http.Response {
	resp, err := client.Get(BaseURL + path)
	if err != nil {
		t.Fatalf("GET %s failed: %v", path, err)
	}
	return resp
}

func ParseJSONResponse[T any](t *testing.T, resp *http.Response) T {
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Error during response reading: %v", err)
	}
	var data T
	if err := json.Unmarshal(body, &data); err != nil {
		t.Fatalf("Error unmarshal JSON: %v\nBody:\n%s", err, body)
	}
	return data
}
